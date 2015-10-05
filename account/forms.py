from django import forms

from .models import UserProfile

class UserProfileForm(forms.ModelForm):
    """A form for editing user profiles.
    """
    full_name = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'Name'})
    )
    email = forms.EmailField(
        required=False,
        widget=forms.EmailInput(attrs={'placeholder': 'Email'})
    )
    bio = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'placeholder': 'Bioghraphy'})
    )

    class Meta:
        model = UserProfile
        fields = ['full_name', 'bio']

    def __init__(self, *args, **kwargs):
        instance = kwargs.get('instance')
        if instance:
            kwargs.setdefault('initial', {}).update({'email': instance.user.email})
        super(UserProfileForm, self).__init__(args, kwargs)

    def save(self, commit=True):
        instance = super(UserProfileForm, self).save(commit)
        if 'email' in self.cleaned_data:
            instance.user.email = self.cleaned_data['email']
            if commit:
                instance.user.save()
        return instance
