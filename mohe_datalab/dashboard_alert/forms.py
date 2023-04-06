from django import forms
from django.utils.translation import gettext_lazy as _

from mohe.alert.models import AlertTemplate
from mohe.diagnostics.models import Biomarker
from mohe.kplex.models import Parameter


class AlertTemplateForm(forms.ModelForm):
    biomarker = forms.ModelChoiceField(queryset=Biomarker.objects.none(), label=_('Parameter'))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        ids = [strip.biomarker_id for strip in Parameter.objects.all()]
        self.fields['biomarker'].queryset = Biomarker.objects.filter(id__in=ids).order_by('name')

    class Meta:
        model = AlertTemplate
        exclude = ('user',)
