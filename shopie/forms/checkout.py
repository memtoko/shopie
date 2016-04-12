from django import forms
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from shopie.payment.backends import payment_backend_pool
from shopie.models import Order

def get_backend_choices():
    backends = payment_backend_pool.get_backend_list()
    list_backends = [(x.backend_name, getattr(x, 'backend_verbose_name', x.backend_name)) for x in backends]
    return tuple(list_backends)

class CheckoutForm(forms.ModelForm):
    """Manage checkout form"""
    full_name = forms.CharField(
        required=True,
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Full name'
            }
        ),
        help_text=_("We use this name to personalize your account experience")
        )
    email = forms.EmailField(
        required=True,
        widget=forms.TextInput(
            attrs={
                'class': 'required',
                'placeholder': 'email',
                'type': 'email'
            }
        ),
        help_text=_("We will send receipt to this email address")
        )
    payment_method = forms.ChoiceField(choices=get_backend_choices(),
        required=True,
        widget=forms.RadioSelect(
            attrs={
                'class': 'required'
            }
        ),
        label=_('Payment method'))
    accept_terms = forms.BooleanField(
            required=True,
            label=_("Saya setuju dengan aturan penggunaan."))

    class Meta:
        model = Order
        fields = ('full_name', 'email')
