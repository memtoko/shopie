from django.views.generic.edit import FormView
from django.utils.translation import ugettext_lazy as _
from django.http import HttpResponseRedirect

from .checkout import CheckoutStepMixin
from shopie.forms.checkout import CheckoutForm
from shopie.utils.current_order import get_or_create_current_order
from shopie.payment.backends import payment_backend_pool

class PaymentCheckoutStep(CheckoutStepMixin, FormView):
    identifier = "payment"
    title = _("Data Diri dan Pembayaran")
    form_class = CheckoutForm
    template_name = "shopie/checkout/payment.html"

    def process(self):
        pass

    def get_form_kwargs(self):
        kwargs = super(PaymentCheckoutStep, self).get_form_kwargs()
        instance = None
        if hasattr(self, 'object'):
            instance = self.object
        else:
            instance = get_or_create_current_order(self.request)
        kwargs.update({'instance': instance})
        return kwargs

    def form_valid(self, form):
        # save the current order
        order = self.object = form.save()
        if not order.user or order.user != self.request.user:
            order.user = self.request.user
        order.proceed_to_confirm()
        order.confirm()
        # proceed this payment according to payment method
        method = form.cleaned_data['payment_method']
        for backend in payment_backend_pool.get_backend_list():
            if backend.backend_name == method:
                break
        else:
            # fool, the method not found
            raise ValueError("Invalid payment method selected")

        # clear the session
        session = getattr(self.request, 'session', None)
        if session is not None:
            session['order_id'] = None

        redirect_to = backend.process_order(order, self.request)
        return HttpResponseRedirect(redirect_to)
