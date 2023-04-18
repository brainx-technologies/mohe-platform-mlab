from django.conf import settings
from django.db import models
from django.urls.base import reverse
from django.utils.translation import gettext_lazy as _

from mohe.client.models import Team
from mohe.measurement.models import Measurement
from mohe_datalab.dashboard.constants import DashboardStyle, Numbers, Compare, DashboardPreset, Period


class Dashboard(models.Model):
    title = models.CharField(_('title'), max_length=100,
                             help_text=_("A short but descriptive title for this dashboard."))
    slug = models.SlugField(_('slug'), blank=True)
    user = models.ForeignKey('client.user', verbose_name=_('user'), on_delete=models.CASCADE)
    preset = models.CharField(_('preset'), max_length=10, choices=DashboardPreset.CHOICES, default=DashboardPreset.HOME,
                              help_text=_("The default configuration for this dashboard"))
    style = models.CharField(_('style'), max_length=30, choices=DashboardStyle.CHOICES,
                             default=settings.MOHE_DASHBOARD_COLOR,
                             help_text=_("The color scheme for this dashboard"))

    kplex = models.ForeignKey('kplex.Kplex', blank=True, null=True, verbose_name=_('kPlex'), on_delete=models.SET_NULL)
    team = models.ForeignKey(Team, blank=True, null=True, verbose_name=_('team'), on_delete=models.SET_NULL)
    status = models.CharField(_('status'), max_length=10, choices=Measurement.Status.choices, blank=True)

    country = models.ForeignKey('geo.country', blank=True, null=True, verbose_name=_('country'),
                                on_delete=models.SET_NULL)

    period = models.IntegerField(_('date range'), choices=Period.CHOICES, default=Period.QUARTER)
    period_from = models.DateField(_('from'), blank=True, null=True)
    period_to = models.DateField(_('to'), blank=True, null=True)

    compare = models.IntegerField(_('compare'), choices=Compare.CHOICES, default=Compare.BEFORE)
    compare_from = models.DateField(_('from'), blank=True, null=True)
    compare_to = models.DateField(_('to'), blank=True, null=True)

    def stylesheet(self):
        return 'stylesheets/dashboard_{0}.scss'.format(self.style)

    def highcharts_theme(self):
        return 'highcharts/themes/{0}.js'.format(self.style)

    def __str__(self):
        return '{0} ({1})'.format(self.title, self.user)

    def get_absolute_url(self):
        if self.slug == "home":
            return reverse("home")
        return reverse("dashboard", args=[self.slug])

    def get_update_url(self):
        return reverse('dashboard_update', args=[self.pk])

    def save(self, *args, **kwargs):
        if self.team is None:
            self.team = self.user.team
        super(Dashboard, self).save(*args, **kwargs)

    class Meta:
        unique_together = ('user', 'slug')
        verbose_name = _('dashboard')
        verbose_name_plural = _('dashboards')


class DashboardModule(models.Model):
    module = models.CharField(_('module'), max_length=30, editable=False)
    title = models.CharField(_('title'), max_length=100)
    dashboard = models.ForeignKey(Dashboard, null=True, verbose_name=_('dashboard'), on_delete=models.CASCADE)
    x = models.IntegerField(_('x'), default=0)
    y = models.IntegerField(_('y'), default=999)
    width = models.IntegerField(_('width'), default=1)
    height = models.IntegerField(_('height'), default=1)

    def save(self, *args, **kwargs):
        if not self.module:
            self.module = self.__class__.__name__.lower()
        self.width = self._width
        self.height = self._height

        super(DashboardModule, self).save(*args, **kwargs)

    def template(self):
        return 'frontend/module/{0}.html'.format(self.module)

    def scripts(self):
        result = []
        if self.module == 'world':
            result.append('highcharts/mapdata/custom/world-robinson.js')
        if self.module == 'countrymodule':
            obj = self.get_object()
            result.append('highcharts/mapdata/countries/{0}/{0}-all.js'.format(obj.country.iso2).lower())
        result.append('js/frontend/module/{0}.js'.format(self.module))
        return result

    def get_object(self):
        return getattr(self, self.module)

    def template(self):
        return 'frontend/module/{0}.html'.format(self.module)


class Number(DashboardModule):
    _width = 2
    _height = 1

    value = models.CharField(_('value'), max_length=20, choices=Numbers.CHOICES)

    class Meta:
        verbose_name = _('number')
        verbose_name_plural = _('number')


class Latest(DashboardModule):
    _width = 4
    _height = 5

    class Meta:
        verbose_name = _('latest results')
        verbose_name_plural = _('latest results')


class TriggerPerKplex(DashboardModule):
    _width = 4
    _height = 5

    class Meta:
        verbose_name = _('trigger per kPlex')
        verbose_name_plural = _('trigger per kPlex')


class Radar(DashboardModule):
    _width = 8
    _height = 5
    lat = models.DecimalField(_('initial latitude'), decimal_places=8, max_digits=12)
    lng = models.DecimalField(_('initial longitude'), decimal_places=8, max_digits=12)
    zoom = models.IntegerField(_('initial zoom'))

    class Meta:
        verbose_name = _('radar')
        verbose_name_plural = _('radar')


class Map(DashboardModule):
    _width = 12
    _height = 11
    lat = models.DecimalField(_('initial latitude'), decimal_places=8, max_digits=12)
    lng = models.DecimalField(_('initial longitude'), decimal_places=8, max_digits=12)
    zoom = models.IntegerField(_('initial zoom'))

    class Meta:
        verbose_name = _('world map')
        verbose_name_plural = _('world map')


class Results(DashboardModule):
    _width = 12
    _height = 11

    class Meta:
        verbose_name = _('full result list')
        verbose_name_plural = _('full result list')


class TriggerPerTest(DashboardModule):
    _width = 4
    _height = 5

    class Meta:
        verbose_name = _('trigger per parameter')
        verbose_name_plural = _('trigger per parameter')


class TeamActivity(DashboardModule):
    _width = 4
    _height = 5

    class Meta:
        verbose_name = _('team activity')
        verbose_name_plural = _('team activity')


class DeviceCapacity(DashboardModule):
    _width = 4
    _height = 5

    class Meta:
        verbose_name = _('remaining reader capacity')
        verbose_name_plural = _('remaining reader capacity')


class CountryModule(DashboardModule):
    _width = 4
    _height = 5
    country = models.ForeignKey('geo.Country', on_delete=models.CASCADE)

    class Meta:
        verbose_name = _('country heat map')
        verbose_name_plural = _('country heat map')


class TestkitStock(DashboardModule):
    _width = 4
    _height = 5

    class Meta:
        verbose_name = _('kPlex in stock')
        verbose_name_plural = _('kPlex in stock')
