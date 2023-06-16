from django import template

from mohe_datalab.dashboard.forms import DashboardFilterForm

register = template.Library()


@register.inclusion_tag('frontend/_module_scripts.html')
def module_scripts(modules):
    scripts = []
    for m in modules:
        for s in m.scripts():
            if s not in scripts:
                scripts.append(s)

    return {'scripts': scripts}


@register.inclusion_tag('frontend/_dashboard_filter.html', takes_context=True)
def dashboard_filter(context, instance):
    request = context['request']
    if request.method == 'POST':
        form = DashboardFilterForm(request.POST, instance=instance)
        if form.is_valid():
            form.save()
    else:
        form = DashboardFilterForm(instance=instance)

    return {
        'instance': instance,
        'form': form
    }
