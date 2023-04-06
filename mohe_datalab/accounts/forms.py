from django import forms
from django.utils.translation import gettext_lazy as _
from mohe.client.models import User


class SettingsForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'title', 'salutation', 'landline', 'mobile')


class SetupForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password_repeat = forms.CharField(widget=forms.PasswordInput, label=_("Repeat password"))

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

    def clean(self):
        data = self.cleaned_data
        password = data.get('password')
        password_repeat = data.get('password_repeat')
        if password != password_repeat:
            raise forms.ValidationError(_("Passwords do not match"))
        return data
