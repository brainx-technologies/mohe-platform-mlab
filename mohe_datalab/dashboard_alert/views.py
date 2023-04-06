from django.contrib import messages
from django.contrib.auth.decorators import user_passes_test
from django.http.response import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls.base import reverse
from django.utils.translation import gettext_lazy as _

from mohe.alert.models import AlertTemplate, Alert
from mohe_datalab.dashboard_alert.forms import AlertTemplateForm


def has_dashboard_access(user):
    return user.is_active and user.is_manager


@user_passes_test(has_dashboard_access)
def alerts(request):
    if 'process' in request.GET:
        pk = request.GET['process']
        Alert.objects.filter(pk=pk, template__user=request.user).update(processed=True)

    if 'delete' in request.GET:
        pk = request.GET['delete']
        Alert.objects.filter(pk=pk, template__user=request.user).delete()

    return render(request, 'alert/alerts.html', {
        'title': _('Alerts'),
        'templates': AlertTemplate.objects.filter(user=request.user).order_by('title'),
        'recent': Alert.objects.filter(template__user=request.user, processed=False).order_by('-id'),
        'previous': Alert.objects.filter(template__user=request.user, processed=True).order_by('-id')[:20],
        'nav_alerts_active': 'active'
    })


@user_passes_test(has_dashboard_access)
def alert_template_form(request, pk=None):
    if pk is None:
        instance = AlertTemplate(user=request.user)
        title = _('Create alert template')
    else:
        instance = get_object_or_404(AlertTemplate, pk=pk, user=request.user)
        title = _('Update alert template')

    if request.method == 'POST':
        form = AlertTemplateForm(request.POST, instance=instance)
        if form.is_valid():
            instance = form.save()
            messages.success(request, _('Template saved successfully.'))
            return HttpResponseRedirect(reverse('alerts'))
    else:
        form = AlertTemplateForm(instance=instance)

    return render(request, 'alert/alert_template_form.html', {
        'title': title,
        'instance': instance,
        'form': form,
        'nav_alerts_active': 'active'
    })


@user_passes_test(has_dashboard_access)
def alert_template_delete(request, pk):
    instance = get_object_or_404(AlertTemplate, pk=pk, user=request.user)

    if request.method == 'POST':
        instance.delete()
        messages.success(request, _('Template deleted successfully.'))
        return HttpResponseRedirect(reverse('alerts'))

    return render(request, 'alert/alert_template_delete.html', {
        'title': _('Delete alert template'),
        'instance': instance,
        'nav_alerts_active': 'active'
    })
