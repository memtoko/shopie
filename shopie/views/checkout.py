from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.views.generic import View

from urllib.parse import urlencode

from shopie.payment.checkout import CheckoutProcess

class BaseCheckoutView(View):
    step_specs = []
    empty_phase_specs = None

    def dispatch(self, request, *args, **kwargs):
        process = CheckoutProcess(
            step_specs=self.step_specs,
            step_kwargs=dict(request=self.request, args=self.args, kwargs=self.kwargs)
        )
        step_identifier = kwargs.get('step')
        if step_identifier == 'reset':
            process.reset()
            return redirect('shopie:redirect')

        current_step = process.prepare_current_step(step_identifier)
        if not current_step.final and current_step.identifier != step_identifier:
            url = reverse("shopie:checkout", kwargs={"step": current_step.identifier})
            params = ("?" + urlencode(request.GET)) if request.GET else ""
            return redirect(url + params)
        return current_step.dispatch(request, *args, **kwargs)

class DefaultCheckoutView(BaseCheckoutView):
    step_specs = [
        "shopie.payment.auth.AuthCheckoutStep",
        "shopie.payment.payment.PaymentCheckoutStep"
    ]
