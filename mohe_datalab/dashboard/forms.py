from django import forms
from django.utils.translation import gettext_lazy as _

from mohe_datalab.dashboard.models import Dashboard, Number, Latest, TriggerPerKplex, Radar, Map, Results, \
    TriggerPerTest, TeamActivity, DeviceCapacity, CountryModule, TestkitStock
from mohe.kplex.models import Kplex
from mohe.measurement.models import Measurement
from mohe_datalab.dashboard.util import map_initial_lat, map_initial_zoom, map_initial_lng


class DashboardCreateForm(forms.ModelForm):
    class Meta:
        model = Dashboard
        fields = ('title', 'preset', 'style')


class DashboardUpdateForm(forms.ModelForm):
    class Meta:
        model = Dashboard
        fields = ('title', 'style')


class DashboardFilterForm(forms.ModelForm):
    kplex = forms.ModelChoiceField(
        queryset=Kplex.objects.all().order_by('name'),
        required=False, widget=forms.RadioSelect
    )

    status = forms.ChoiceField(choices=[('', 'All')] + list(Measurement.Status.choices),
                               widget=forms.RadioSelect,
                               required=False)

    class Meta:
        model = Dashboard
        fields = ('kplex', 'team', 'status',
                  'period', 'period_from', 'period_to',
                  'compare', 'compare_from', 'compare_to')
        widgets = {
            'kplex': forms.RadioSelect
        }


class NumberForm(forms.ModelForm):
    class Meta:
        model = Number
        fields = ('title', 'value',)


class LatestForm(forms.ModelForm):
    class Meta:
        model = Latest
        fields = ('title',)


class TriggerPerKplexForm(forms.ModelForm):
    class Meta:
        model = TriggerPerKplex
        fields = ('title',)


class RadarForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        dashboard = kwargs['instance'].dashboard
        kwargs['initial'] = {
            'lat': map_initial_lat(dashboard.user),
            'lng': map_initial_lng(dashboard.user),
            'zoom': map_initial_zoom(dashboard.user)
        }
        super().__init__(*args, **kwargs)

    class Meta:
        model = Radar
        fields = ('title', 'lat', 'lng', 'zoom')


class MapForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        dashboard = kwargs['instance'].dashboard
        kwargs['initial'] = {
            'lat': map_initial_lat(dashboard.user),
            'lng': map_initial_lng(dashboard.user),
            'zoom': map_initial_zoom(dashboard.user)
        }
        super().__init__(*args, **kwargs)

    class Meta:
        model = Map
        fields = ('title', 'lat', 'lng', 'zoom')


class ResultsForm(forms.ModelForm):
    class Meta:
        model = Results
        fields = ('title',)


class TriggerPerTestForm(forms.ModelForm):
    class Meta:
        model = TriggerPerTest
        fields = ('title',)


class TeamActivityForm(forms.ModelForm):
    class Meta:
        model = TeamActivity
        fields = ('title',)


class DeviceCapacityForm(forms.ModelForm):
    class Meta:
        model = DeviceCapacity
        fields = ('title',)


class CountryForm(forms.ModelForm):
    class Meta:
        model = CountryModule
        fields = ('title', 'country')


class TestkitStockForm(forms.ModelForm):
    class Meta:
        model = TestkitStock
        fields = ('title',)


class Widgets(object):
    NUMBER = 'number'
    LATEST = 'latest'
    TRIGGER_PER_KPLEX = 'triggerperkplex'
    RADAR = 'radar'
    MAP = 'map'
    RESULTS = 'results'
    TRIGGER_PER_TEST = 'trigger_per_test'
    TEAM_ACTIVITY = 'teamactivity'
    DEVICE_CAPACITY = 'devicecapacity'
    COUNTRY = 'countrymodule'
    TESTKIT_STOCK = 'testkitstock'

    CHOICES = (
        (NUMBER, _('Number')),
        (LATEST, _('Latest results')),
        (TRIGGER_PER_KPLEX, _('Trigger per kPlex')),
        (RADAR, _('Radar')),
        (MAP, _('World Map (full screen)')),
        (RESULTS, _('Full result list (full screen)')),
        (TRIGGER_PER_TEST, _('Trigger per test')),
        (TEAM_ACTIVITY, _('Team activity')),
        (DEVICE_CAPACITY, _('Remaining reader capacity')),
        (COUNTRY, _('Country heat map')),
        (TESTKIT_STOCK, _('kPlex in stock'))
    )

    FORMS = {
        NUMBER: NumberForm,
        LATEST: LatestForm,
        TRIGGER_PER_KPLEX: TriggerPerKplexForm,
        RADAR: RadarForm,
        MAP: MapForm,
        RESULTS: ResultsForm,
        TRIGGER_PER_TEST: TriggerPerTestForm,
        TEAM_ACTIVITY: TeamActivityForm,
        DEVICE_CAPACITY: DeviceCapacityForm,
        COUNTRY: CountryForm,
        TESTKIT_STOCK: TestkitStockForm
    }

    MODELS = {
        NUMBER: Number,
        LATEST: Latest,
        TRIGGER_PER_KPLEX: TriggerPerKplex,
        RADAR: Radar,
        MAP: Map,
        RESULTS: Results,
        TRIGGER_PER_TEST: TriggerPerTest,
        TEAM_ACTIVITY: TeamActivity,
        DEVICE_CAPACITY: DeviceCapacity,
        COUNTRY: CountryModule,
        TESTKIT_STOCK: TestkitStock
    }


class WidgetAddForm(forms.Form):
    module = forms.ChoiceField(choices=Widgets.CHOICES, label=_('Type'))
