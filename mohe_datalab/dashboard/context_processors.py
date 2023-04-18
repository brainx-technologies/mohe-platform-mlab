from mohe.client.models import Team
from mohe.util.models import Configuration
from mohe_datalab.dashboard.models import Dashboard


def config(request):
    config, created = Configuration.objects.get_or_create(pk=1)
    return {
        'config': config
    }


def dashboards(request):
    if request.user.is_anonymous:
        return {}

    dashboard_teams = [t for t in Team.objects.all()]

    return {
        'dashboards': Dashboard.objects.filter(user=request.user).order_by('id'),
        'dashboard_teams': dashboard_teams
    }
