from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponseRedirect
from django.shortcuts import render
from django.urls.base import reverse
from django.utils.translation import gettext as _

from mohe_datalab.accounts.forms import SettingsForm, SetupForm
from mohe.client.models import User


@login_required
def settings(request):
    if request.method == 'POST':
        form = SettingsForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.info(request, _('Your changes have been saved.'))
    else:
        form = SettingsForm(instance=request.user)

    return render(request, 'accounts/settings.html', {
        'title': _('Settings'),
        'form': form,
        'user': request.user,
    })



def setup(request):
    if User.objects.all().count() > 0:
        return HttpResponseRedirect(reverse("setup_completed"))

    if request.method == "POST":
        form = SetupForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data.get('password'))
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.save()
            return HttpResponseRedirect(reverse("setup_completed"))
    else:
        form = SetupForm()

    return render(request, "accounts/setup.html", {
        'form': form
    })


def setup_completed(request):
    return render(request, 'accounts/setup_completed.html')
