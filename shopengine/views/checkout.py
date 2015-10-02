import urllib

from django.shortcuts import render, redirect
from django.http import Http404
from django.core.urlresolvers import reverse
from django.views.generic import View
from django.utils.decorators import method_decorator

from shopengine.models import Order
from shopengine.forms.checkout import CheckoutForm
from shopengine.payment.checkout import CheckoutProcess
from shopengine.decorators import cart_nonempty_required

def checkout_thankyou(request, order_key):
	"""View for thank you page."""
    try:
        order = Order.objects.get(order_key=order_key)
    except Order.DoesNotExist:
        raise Http404()
    else:
        return render(request, "shopengine/payment/thank_you.html", {'order': order})

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
