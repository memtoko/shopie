from django import forms
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from shopengine.payment.backends import payment_backend_pool

def get_backend_choices():
    backends = payment_backend_pool.get_backend_list()
    list_backends = [('', _('Pilih metode pembayaran'))]
    temp = [(x.url_namespace, getattr(x, 'backend_verbose_name', x.backend_name)) for x in backends]
    list_backends.extend(temp)
    return tuple(list_backends)

class CheckoutForm(forms.Form):
    """Manage checkout form"""
    name = forms.CharField(
        required=True,
        widget=forms.TextInput(
            attrs={
                'placeholder': 'name'
            }
        ),
        help_text=_("We use this name to personalize your account experience")
        )
    email = forms.EmailField(
        required=True,
        widget=forms.TextInput(
            attrs={
                'placeholder': 'email'
            }
        ),
        help_text=_("We will send receipt to this email address")
        )
    payment_methods = forms.ChoiceField(choices=get_backend_choices(),
        required=True,
        label=_('Payment method'))
    accept_terms = forms.BooleanField(
            required=True,
            label=_("Saya setuju dengan aturan penggunaan."))





