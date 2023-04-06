from mohe.datalab.constants import DashboardPreset
from mohe.datalab.models import Dashboard, DashboardModule, TeamActivity, TriggerPerKplex, \
    TriggerPerTest, Radar, Map, Results, Number, TestkitStock
from mohe.util.models import Configuration


def map_initial_lat(user):
    return Configuration.get_default().map_initial_lat


def map_initial_lng(user):
    return Configuration.get_default().map_initial_lng


def map_initial_zoom(user):
    return Configuration.get_default().map_initial_zoom


def init_user_dashboards(user):
    if Dashboard.objects.filter(user=user, slug="home").count() == 0:
        d = Dashboard(user=user, preset=DashboardPreset.HOME, slug="home", title='Dashboard')
        d.save()
        do_dashboard_reset(d)

    if Dashboard.objects.filter(user=user, slug="map").count() == 0:
        d = Dashboard(user=user, preset=DashboardPreset.MAP, slug="map", title='Map')
        d.save()
        do_dashboard_reset(d)

    if Dashboard.objects.filter(user=user, slug="results").count() == 0:
        d = Dashboard(user=user, preset=DashboardPreset.RESULTS, slug="results", title='Results')
        d.save()
        do_dashboard_reset(d)


def do_dashboard_reset(dashboard):
    # delete existing modules
    for m in DashboardModule.objects.filter(dashboard=dashboard):
        o = m.get_object()
        o.delete()

    # create new modules depending on preset
    if dashboard.preset == DashboardPreset.HOME:
        Number(dashboard=dashboard, x=0, y=0, value='stock', title='kPlex in stock').save()
        Number(dashboard=dashboard, x=2, y=0, value='readers', title='Active readers').save()
        Number(dashboard=dashboard, x=4, y=0, value='total', title='Total tests').save()
        Number(dashboard=dashboard, x=6, y=0, value='clear', title='Negative tests').save()
        Number(dashboard=dashboard, x=8, y=0, value='trigger', title='Positive tests').save()
        Number(dashboard=dashboard, x=10, y=0, value='invalid', title='Invalid tests').save()

        Radar(dashboard=dashboard, x=0, y=2, title='Radar', lat=map_initial_lat(dashboard.user), lng=map_initial_lng(dashboard.user),
              zoom=map_initial_zoom(dashboard.user)).save()
        TriggerPerTest(dashboard=dashboard, x=8, y=4, title='Positive tests per parameter').save()

        TriggerPerKplex(dashboard=dashboard, x=0, y=7, title='Positive tests per kPlex').save()
        TeamActivity(dashboard=dashboard, x=4, y=7, title='Team activity').save()
        TestkitStock(dashboard=dashboard, x=8, y=7, title='kPlex Stock').save()

    if dashboard.preset == DashboardPreset.MAP:
        Map(dashboard=dashboard, x=0, y=0, title='Interactive map', lat=map_initial_lat(dashboard.user),
            lng=map_initial_lng(dashboard.user), zoom=map_initial_zoom(dashboard.user)).save()

    if dashboard.preset == DashboardPreset.RESULTS:
        Results(dashboard=dashboard, x=0, y=0, title='Result list').save()
