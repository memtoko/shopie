from django import forms
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from shopengine.models import Issue, Reply

class IssueCreationForm(forms.ModelForm):
    title = forms.CharField(required=True,
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Title'
            }
        )
    )
    body = forms.CharField(required=True,
        widget=forms.Textarea(
            attrs={
                'placeholder': 'markdown supported'
            }
        )
    )

    class Meta:
        model = Issue
        fields = ('title', 'body',)

class ReplyCreationForm(forms.ModelForm):
    body = forms.CharField(required=True,
        widget=forms.Textarea(
            attrs={
                'placeholder': 'markdown supported'
            }
        )
    )

    class Meta:
        model = Reply
        fields = ('body',)
