from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import user_passes_test
from django.http.response import HttpResponseRedirect
from django.shortcuts import render, get_object_or_404, redirect
from django.urls.base import reverse
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from mohe_datalab.dashboard.models import Dashboard, DashboardModule
from mohe_datalab.dashboard.export import export_dashboard
from mohe_datalab.dashboard.forms import DashboardCreateForm, DashboardFilterForm, WidgetAddForm, Widgets, \
    DashboardUpdateForm
from mohe_datalab.dashboard.util import init_user_dashboards, do_dashboard_reset


#from mohe.alert.models import AlertTemplate, Alert


def has_dastalab_access(user):
    return user.is_active and user.is_manager


@user_passes_test(has_dastalab_access)
def trigger_error(request):
    division_by_zero = 1 / 0


@user_passes_test(has_dastalab_access)
def home(request):
    if Dashboard.objects.filter(user=request.user, slug="home").count() == 0:
        init_user_dashboards(request.user)

    return dashboard(request, "home")


def redirect_home(request, pk):
    return HttpResponseRedirect(reverse('home'))


@user_passes_test(has_dastalab_access)
def dashboard(request, slug):


    if slug=="calendar": 
        instance = get_object_or_404(Dashboard, user=request.user, slug="results")
        print("------------------------------------calendar------------------------------------------")
        update = False
        if request.method == 'POST':
            form = DashboardFilterForm(request.POST, instance=instance)
            if form.is_valid():
                form.save()
        else:
            form = DashboardFilterForm(instance=instance)

        return render(request, 'frontend/calendar.html', {
            'title': "Calendar",
            'instance': instance,
            'modules': instance.dashboardmodule_set.all(),
            'form': form,
            'update': update,
            'widget_form': WidgetAddForm(),
            'google_api_key': settings.GOOGLE_API_KEY,
            'can_add_dashboard': True,
            'can_update_dashboard': True
        })

    instance = get_object_or_404(Dashboard, user=request.user, slug=slug)

    if "reset" in request.GET:
        update = True
        dashboard_reset(request, slug)
        return HttpResponseRedirect('?update=1')

    elif 'update' in request.GET or 'update' in request.POST:
        update = True
        if request.method == 'POST':
            form = DashboardCreateForm(request.POST, instance=instance)

            if form.is_valid():
                form.save()
        else:
            form = DashboardCreateForm(instance=instance)

    else:
        update = False
        if request.method == 'POST':
            form = DashboardFilterForm(request.POST, instance=instance)
            if form.is_valid():
                form.save()
        else:
            form = DashboardFilterForm(instance=instance)

    return render(request, 'frontend/dashboard.html', {
        'title': instance.title,
        'instance': instance,
        'modules': instance.dashboardmodule_set.all(),
        'form': form,
        'update': update,
        'widget_form': WidgetAddForm(),
        'google_api_key': settings.GOOGLE_API_KEY,
        'can_add_dashboard': True,
        'can_update_dashboard': True
    })


@user_passes_test(has_dastalab_access)
def dashboard_update(request, slug):
    instance = get_object_or_404(Dashboard, user=request.user, slug=slug)
    if request.method == 'POST':
        form = DashboardUpdateForm(request.POST, instance=instance)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(instance.get_absolute_url())
    else:
        form = DashboardUpdateForm(instance=instance)
    return render(request, 'frontend/dashboard_update.html', {
        'form': form,
        'instance': instance,
    })


@user_passes_test(has_dastalab_access)
def dashboard_reset(request, slug):
    instance = get_object_or_404(Dashboard, user=request.user, slug=slug)
    do_dashboard_reset(instance)
    return redirect('dashboard_update', instance.slug)


@user_passes_test(has_dastalab_access)
def dashboard_export(request, pk):
    instance = get_object_or_404(Dashboard, user=request.user, pk=pk)
    return export_dashboard(instance, request.GET.get('format'))


@user_passes_test(has_dastalab_access)
def dashboard_add(request):
    if request.method == 'POST':
        instance = Dashboard(user=request.user)
        form = DashboardCreateForm(request.POST, instance=instance)
        if form.is_valid():

            instance = form.save(commit=False)
            original_slug = slugify(instance.title)
            slug = original_slug
            i = 0
            while Dashboard.objects.filter(user=request.user, slug=slug).count() > 0:
                i += 1
                slug = "{0}-{1}".format(original_slug, i)
            instance.slug = slug
            instance.save()
            dashboard_reset(request, slug)

            return HttpResponseRedirect(instance.get_absolute_url())
    else:
        form = DashboardCreateForm()

    return render(request, 'frontend/dashboard_add.html', {
        'title': _('Create Dashboard'),
        'form': form
    })


@user_passes_test(has_dastalab_access)
def dashboard_delete(request, slug):
    instance = get_object_or_404(Dashboard, user=request.user, slug=slug)

    if instance.slug == 'home':
        messages.error(request, "Can not delete this dashboard.")
        return HttpResponseRedirect(reverse('home'))

    if request.method == 'POST':
        instance.delete()
        return HttpResponseRedirect(reverse('home'))

    return render(request, 'frontend/dashboard_delete.html', {
        'instance': instance,
        'title': _('Delete dashboard')
    })


@user_passes_test(has_dastalab_access)
def widget_form(request, pk=None):
    if pk is None:
        title = _('Add widget')
        dashboard = get_object_or_404(Dashboard, pk=request.GET.get('dashboard'))
        form_class = Widgets.FORMS[request.GET.get('module')]
        model_class = Widgets.MODELS[request.GET.get('module')]
        instance = model_class(dashboard=dashboard, title=model_class._meta.verbose_name)
    else:
        widget = get_object_or_404(DashboardModule, pk=pk, dashboard__user=request.user)
        instance = widget.get_object()
        dashboard = instance.dashboard
        form_class = Widgets.FORMS[instance.__class__.__name__.lower()]
        title = _('Update widget')

    if request.method == 'POST':
        form = form_class(request.POST, instance=instance)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(dashboard.get_absolute_url() + '?update=1')
    else:
        form = form_class(instance=instance)

    return render(request, 'frontend/widget_form.html', {
        'form': form,
        'title': title
    })

