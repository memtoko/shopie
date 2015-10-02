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
    payment_methods = forms.ChoiceField(choices=get_backend_choices(),
        required=True,
        label=_('Payment method'))




