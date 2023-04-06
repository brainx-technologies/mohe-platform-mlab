import datetime
import json

from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models.aggregates import Count, Sum
from django.db.models.query_utils import Q
from django.http.response import HttpResponse, HttpResponseForbidden
from django.shortcuts import get_object_or_404

from mohe.alert.models import Alert
from mohe.client.models import Team
from mohe.datalab.models import DashboardModule, Dashboard, Number, Latest, TriggerPerKplex, Radar, \
    Results, TriggerPerTest, TeamActivity, CountryModule, TestkitStock, Map
from mohe.diagnostics.models import Biomarker
from mohe.geo.models import Province
from mohe.hardware.models import Device
from mohe.kplex.models import Kplex
from mohe.measurement.models import Measurement
from mohe.supply.models import TestKitStock
from .util import period_measurements, compare_measurements
from .util import period_tests, compare_tests, _period_interval, date_to_miliseconds


def api(func):
    def wrap(request, *args, **kwargs):
        if request.user.is_anonymous:
            return HttpResponseForbidden('{"error": "authentication required}', content_type='application/json')
        result = func(request, *args, **kwargs)
        return HttpResponse(json.dumps(result), content_type='application/json')

    return wrap


@api
def dashboard(request):
    pk = request.GET.get('pk')
    instance = get_object_or_404(Dashboard, pk=pk, user=request.user)

    if 'update' in request.GET:
        instance.team_id = request.GET.get('team', None)
        instance.kplex_id = request.GET.get('kplex', None)
        instance.status = request.GET.get('status', '')
        instance.save()

    return {
        'status': instance.status,
        'team': instance.team_id,
        'kplex': instance.kplex_id
    }


@api
def widget(request):
    if 'update' in request.GET:
        data = json.loads(request.GET.get('update'))
        for item in data:
            DashboardModule.objects.filter(pk=item[0]).update(x=item[1], y=item[2])

    if 'delete' in request.GET:
        pk = request.GET.get('delete')
        instance = get_object_or_404(DashboardModule, pk=pk, dashboard__user=request.user)
        obj = instance.get_object()
        obj.delete()

    return {}


@api
def number(request, pk):
    instance = get_object_or_404(Number, pk=pk, dashboard__user=request.user)
    period = period_measurements(instance.dashboard)
    compare = compare_measurements(instance.dashboard)

    if instance.value == 'total':
        response = {
            'period': period.count(),
            'compare': compare.count()
        }
    elif instance.value == 'clear':
        response = {
            'period': period.filter(status=Measurement.Status.CLEAR).count(),
            'compare': compare.filter(status=Measurement.Status.CLEAR).count()
        }
    elif instance.value == 'trigger':
        response = {
            'period': period.filter(status=Measurement.Status.TRIGGER).count(),
            'compare': compare.filter(status=Measurement.Status.TRIGGER).count(),
        }
    elif instance.value == 'invalid':
        response = {
            'period': period.filter(status=Measurement.Status.INVALID).count(),
            'compare': compare.filter(status=Measurement.Status.INVALID).count(),
        }
    elif instance.value == 'stock':
        qs = Measurement.objects.all()
        stock = TestKitStock.objects.filter(delivery_date__isnull=False)
        if instance.dashboard.kplex:
            qs = qs.filter(kplex=instance.dashboard.kplex)
            stock = stock.filter(kplex=instance.dashboard.kplex)

        total = - qs.count()
        for d in stock:
            total += d.amount

        response = {
            'period': total
        }
    else:
        response = {
            'period': Device.objects.all().count()
        }

    # numbers never < 0
    for k, v in response.items():
        if v < 0:
            response[k] = 0

    return response


@api
def latest(request, pk):
    instance = get_object_or_404(Latest, pk=pk, dashboard__user=request.user)
    qs = period_measurements(instance.dashboard)

    qs = qs.order_by('-id')[:20]
    result = []
    for m in qs:
        result.append(m.to_json())

    return {'result': result}


@api
def trigger_per_kplex(request, pk):
    instance = get_object_or_404(TriggerPerKplex, pk=pk, dashboard__user=request.user)
    period = period_measurements(instance.dashboard).filter(status=Measurement.Status.TRIGGER)

    fingerprint = []
    result = []
    kplex = {}

    if instance.dashboard.kplex:
        testkits = [instance.dashboard.kplex]
    else:
        testkits = Kplex.objects.all().order_by('acronym')

    start, end, interval = _period_interval(instance.dashboard)
    count = 0

    for o in testkits:
        testkit_count = 0
        kplex[o.acronym] = o.name
        result.append({'name': o.acronym, 'data': []})
        _start = start
        while _start < end:
            _end = _start + datetime.timedelta(days=interval)
            dt = date_to_miliseconds(_start)
            _count = period.filter(measurement_date__gte=_start, measurement_date__lt=_end, kplex=o).count()
            result[-1]['data'].append((dt, _count))
            _start += datetime.timedelta(days=interval)
            testkit_count += _count

        fingerprint.append(str(testkit_count))
        count += testkit_count

    return {'result': result, 'fingerprint': ','.join(fingerprint), 'count': count, 'kplex': kplex}


@api
def radar(request, pk):
    instance = get_object_or_404(Radar, pk=pk, dashboard__user=request.user)
    qs = period_measurements(instance.dashboard)

    qs = qs.order_by('-id')[:10]
    result = []
    for m in qs:
        result.append(m.to_json())

    return {'result': result}


@api
def map(request, pk):
    """
    :param request: 
    :param pk: 
    :return: results ordered by date 
    """
    instance = get_object_or_404(Map, pk=pk, dashboard__user=request.user)
    qs = period_measurements(instance.dashboard)

    if instance.dashboard.status:
        qs = qs.filter(status=instance.dashboard.status)

    qs = qs.order_by('measurement_date').select_related('kplex')

    result = [m.to_basic_json() for m in qs]

    return {'result': result}


@api
def results(request, pk):
    instance = get_object_or_404(Results, pk=pk, dashboard__user=request.user)

    qs = period_measurements(instance.dashboard)
    # search for id
    q = request.GET.get('q')

    if q:
        if q.isdigit():
            qs = qs.filter(id=q)
        else:
            query = Q(title__icontains=q) | Q(team__name__icontains=q) | Q(device__serial_number__icontains=q)
            qs = qs.filter(query)

    if instance.dashboard.status:
        qs = qs.filter(status=instance.dashboard.status)
    qs = qs.order_by('-id')

    paginator = Paginator(qs, 50)

    try:
        page = int(request.GET.get('p'))
    except:
        page = 1

    try:
        measurements = paginator.page(page)
    except PageNotAnInteger:
        measurements = paginator.page(1)
    except EmptyPage:
        measurements = paginator.page(paginator.num_pages)

    result_list = [m.to_json() for m in measurements]

    return {
        'result': result_list,
        'num_pages': paginator.num_pages,
        'page': page
    }


@api
def trigger_per_test(request, pk):
    instance = get_object_or_404(TriggerPerTest, pk=pk, dashboard__user=request.user)
    qs = period_tests(instance.dashboard)
    qs = qs.filter(status=Measurement.Status.TRIGGER).values('biomarker').annotate(total=Count('biomarker'))
    _period = {}
    for r in qs:
        _period[r['biomarker']] = r['total']

    qs = compare_tests(instance.dashboard)
    qs = qs.filter(status=Measurement.Status.TRIGGER).values('biomarker').annotate(total=Count('biomarker'))
    _compare = {}
    for r in qs:
        _compare[r['biomarker']] = r['total']

    categories = []
    period = []
    compare = []
    parameters = {}
    fingerprint = []
    count = 0

    for test in Biomarker.objects.all().order_by('name'):
        if test.id in _period or test.id in _compare:
            categories.append(test.acronym)
            parameters[test.acronym] = test.name

            value = _period.get(test.id, 0)
            period.append(value)
            fingerprint.append(str(value))
            count += value

            value = _compare.get(test.id, 0)
            compare.append(value)
            fingerprint.append(str(value))
            count += value

    return {
        'categories': categories,
        'period': period,
        'compare': compare,
        'parameters': parameters,
        'fingerprint': ','.join(fingerprint),
        'count': count
    }


@api
def team_activity(request, pk):
    instance = get_object_or_404(TeamActivity, pk=pk, dashboard__user=request.user)
    _period = period_measurements(instance.dashboard)
    _compare = compare_measurements(instance.dashboard)

    categories = []
    period = []
    compare = []
    fingerprint = []
    count = 0

    for team in Team.objects.all():
        categories.append(team.name)

        period_count = _period.filter(team=team).count()
        period.append(period_count)
        fingerprint.append(str(period_count))
        count += period_count

        compare_count = _compare.filter(team=team).count()
        compare.append(compare_count)
        fingerprint.append(str(compare_count))
        count += compare_count

    return {
        'categories': categories,
        'period': period,
        'compare': compare,
        'fingerprint': ','.join(fingerprint),
        'count': count
    }


@api
def device_capacity(request, pk):
    result = []
    for d in Device.objects.all():
        result.append((d.num_measurements, d.remaining_capacity))
    return {'result': result}


@api
def country(request, pk):
    """
    Data for country heatmap. Only triggered results.
    
    :param request: 
    :param pk: 
    :return: 
    """
    instance = get_object_or_404(CountryModule, pk=pk, dashboard__user=request.user)
    qs = period_measurements(instance.dashboard)
    qs = qs.filter(country=instance.country, status=Measurement.Status.TRIGGER)

    result = []
    for province in Province.objects.filter(country=instance.country):
        key = '{0}-{1}'.format(instance.country.iso2, province.code).lower()
        count = qs.filter(province=province).count()
        result.append((key, count))

    return {
        'country': instance.country.iso2.lower(),
        'result': result
    }


@api
def testkit_stock(request, pk):
    instance = get_object_or_404(TestkitStock, pk=pk, dashboard__user=request.user)
    start, end, interval = _period_interval(instance.dashboard)
    today = datetime.date.today()

    series = []
    for kplex in Kplex.objects.all():

        series.append({
            'name': kplex.acronym,
            'data': []
        })

        day = start
        while day < today:
            day += datetime.timedelta(days=interval)
            end = day + datetime.timedelta(days=interval)
            m = Measurement.objects.filter(kplex=kplex, measurement_date__lt=end, measurement_date__gt=day).count()
            total = Measurement.objects.filter(kplex=kplex, measurement_date__lt=end).count()
            stock = TestKitStock.objects.filter(kplex=kplex, delivery_date__lt=end).aggregate(Sum('amount'))
            amount = stock['amount__sum']

            if amount is None:
                amount = 0
            series[-1]['data'].append((date_to_miliseconds(day), amount - total))

    return {
        'result': series
    }


@api
def result(request, pk):
    m = get_object_or_404(Measurement, pk=pk)
    return {'result': m.to_json()}


@api
def alert_count(request):
    return {
        'new': Alert.objects.filter(template__user=request.user, processed=False).count(),
        'processed': Alert.objects.filter(template__user=request.user, processed=True).count()
    }
