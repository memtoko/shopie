from django.core.urlresolvers import reverse, NoReverseMatch
from django.http import HttpResponseRedirect
from django.views.generic import FormView

from shopengine.forms.checkout import CheckoutForm
from .checkout import CheckoutStepMixin

class PaymentCheckoutStep(CheckoutStepMixin, FormView):
    identifier = 'payment'
    title = _('Pembayaran')

