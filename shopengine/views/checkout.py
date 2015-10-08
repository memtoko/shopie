import urllib

from django.shortcuts import get_object_or_404, render, redirect
from django.http import Http404, HttpResponseBadRequest
from django.core.urlresolvers import reverse
from django.views.generic import View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

from shopengine.models import Order
from shopengine.forms.checkout import CheckoutForm
from shopengine.payment.checkout import CheckoutProcess
from shopengine.decorators import cart_nonempty_required


class BaseCheckoutView(View):
    step_specs = []

    @method_decorator(cart_nonempty_required('cart'))
    def dispatch(self, request, *args, **kwargs):
        process = CheckoutProcess(
            step_specs=self.step_specs,
            step_kwargs=dict(request=self.request, args=self.args, kwargs=self.kwargs)
        )
        step_id = kwargs.get('step')
        if step_id == 'reset':
            process.reset()
            return redirect(reverse('checkout'))

        current_step = process.prepare_current_step(step_id)
        if not current_step.final and current_step.identifier != step_id:
            url = reverse("checkout", kwargs={"step": current_step.identifier})
            params = ("?" + urllib.parse.urlencode(request.GET)) if request.GET else ""
            return redirect(url + params)
        return current_step.dispatch(request, *args, **kwargs)

class CheckoutView(BaseCheckoutView):
    """This is base default checkout views"""
    step_specs = [
        'shopengine.payment.auth:AuthCheckoutStep',
        'shopengine.payment.method:PaymentCheckoutStep'
    ]
    empty_phase_spec = None

@login_required
def checkout_thank_you(request, order_key):
    order = get_object_or_404(Order, order_key=order_key)
    if order.user != request.user:
        raise HttpResponseBadRequest('You dont have permission to view this page.')
    return render(request, "shopengine/checkout/thank_you.html", {
            'order': order
        })
