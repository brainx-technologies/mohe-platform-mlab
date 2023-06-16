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

    return {
        'dashboards': Dashboard.objects.filter(user=request.user).order_by('id'),
    }
