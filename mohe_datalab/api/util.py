import datetime
import time

from mohe.client.models import Team
from mohe.datalab.constants import Period, Compare
from mohe.measurement.models import Measurement, Result


def date_to_miliseconds(date):
    return int(time.mktime(date.timetuple()) * 1000)


def _period_interval(instance):
    today = datetime.date.today() + datetime.timedelta(days=1)
    end = today

    if instance.period == Period.WEEK:
        start = end - datetime.timedelta(days=7)
        interval = 1
    elif instance.period == Period.MONTH:
        start = end - datetime.timedelta(days=30)
        interval = 3
    elif instance.period == Period.QUARTER:
        start = end - datetime.timedelta(days=90)
        interval = 9
    elif instance.period == Period.YEAR:
        start = end - datetime.timedelta(days=360)
        interval = 30
    else:
        start = end - datetime.timedelta(days=90)
        if instance.period_from:
            start = instance.period_from

        end = today
        if instance.period_to:
            end = instance.period_to + datetime.timedelta(days=1)

        interval = int((end - start).days / 10)

    return start, end, interval


def _compare_interval(instance):
    _start, _end, interval = _period_interval(instance)
    diff = (_end - _start).days

    end = _start
    start = end - datetime.timedelta(days=diff)

    if instance.compare == Compare.MANUAL:
        if instance.compare_to:
            end = instance.compare_to + datetime.timedelta(days=1)

        if instance.compare_from:
            start = instance.compare_from

    return start, end


def period_measurements(instance):
    qs = Measurement.objects.all().exclude(status=Measurement.Status.EXPIRED)

    team = instance.team
    if not team:
        team = instance.user.team

    if team:
        teams = Team.objects.all()
        qs = qs.filter(team__in=teams)
    else:
        qs = qs.filter(user=instance.user)

    if instance.kplex:
        qs = qs.filter(kplex=instance.kplex)

    start, end, interval = _period_interval(instance)
    if start:
        qs = qs.filter(measurement_date__gt=start)
    if end:
        qs = qs.filter(measurement_date__lte=end)

    return qs


def compare_measurements(instance):
    qs = Measurement.objects.all().exclude(status=Measurement.Status.EXPIRED)

    team = instance.team
    if not team:
        team = instance.user.team
    if team:
        teams = Team.objects.all()
        qs = qs.filter(team__in=teams)
    else:
        qs = qs.filter(user=instance.user)

    if instance.kplex:
        qs = qs.filter(kplex=instance.kplex)

    start, end = _compare_interval(instance)

    if start:
        qs = qs.filter(measurement_date__gt=start)
    if end:
        qs = qs.filter(measurement_date__lte=end)

    return qs


def period_tests(instance):
    qs = Result.objects.all()

    team = instance.team
    if not team:
        team = instance.user.team
    if team:
        teams = Team.objects.all()
        qs = qs.filter(measurement__team__in=teams)
    else:
        qs = qs.filter(measurement__user=instance.user)

    if instance.kplex:
        qs = qs.filter(measurement__kplex=instance.kplex)

    start, end, interval = _period_interval(instance)
    if start:
        qs = qs.filter(measurement__measurement_date__gt=start)
    if end:
        qs = qs.filter(measurement__measurement_date__lte=end)

    return qs


def compare_tests(instance):
    qs = Result.objects.all()

    team = instance.team
    if not team:
        team = instance.user.team
    if team:
        teams = Team.objects.all()
        qs = qs.filter(measurement__team__in=teams)
    else:
        qs = qs.filter(measurement__user=instance.user)

    if instance.kplex:
        qs = qs.filter(measurement__kplex=instance.kplex)

    start, end = _compare_interval(instance)

    if start:
        qs = qs.filter(measurement__measurement_date__gt=start)
    if end:
        qs = qs.filter(measurement__measurement_date__lte=end)

    return qs
