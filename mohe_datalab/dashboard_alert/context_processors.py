from mohe.alert.models import Alert


def alerts(request):
    if request.user.is_anonymous:
        return {}
    return {
        'has_alerts': Alert.objects.filter(template__user=request.user, processed=False).count()
    }
