from django.core.urlresolvers import reverse, NoReverseMatch
from django.http import HttpResponseRedirect
from django.views.generic import FormView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.debug import sensitive_post_parameters
from django.contrib.auth.models import AnonymousUser
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.decorators import login_required

from shopengine.forms.checkout import CheckoutForm
from shopengine.cart.bucket import get_or_create_cart
from shopengine.models import Order
from .checkout import CheckoutStepMixin

class PaymentCheckoutStep(CheckoutStepMixin, FormView):
    identifier = 'payment'
    title = _('Pembayaran')
    template_name = "shopengine/checkout/payment.html"
    form_class = CheckoutForm

    @method_decorator(login_required(login_url='checkout'))
    def dispatch(self, request, *args, **kwargs):
        return super(PaymentCheckoutStep, self).dispatch(request, *args, **kwargs)

    @method_decorator(sensitive_post_parameters())
    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def pos(self, request, *args, **kwargs):
        return super(PaymentCheckoutStep, self).pos(request, *args, **kwargs)

    def is_valid(self):
        return bool(self.storage.get('accept_terms'))

    def process(self): pass

    def get_initial(self, request=None):
        request = request or self.request
        if request.user and not isinstance(request.user, AnonymousUser):
            return {
                'name': request.user.first_name or request.user.username,
                'email': request.user.email
            }
        return super(PaymentCheckoutStep, self).get_initial()

    def form_valid(self, form):
        for key, value in self.cleaned_data.items():
            self.storage[key] = value

        self.process()
        order = self.create_order_from_cart()
        backend_namespace = self.storage['payment_methods']
        try:
            return HttpResponseRedirect(reverse(backend_namespace))
        except NoReverseMatch:
            # add warning then redirect
            return HttpResponseRedirect(reverse('cart'))
        finally:
            self.checkout.process.complete()

    def create_order_from_cart(self, request=None):
        request = request or self.request
        cart = get_or_create_cart(request)
        cart.update(request)
        order = Order.objects.create_from_cart(cart, request)
        # add the details
        order.full_name = self.cleaned_data['name']
        order.email = self.cleaned_data['email']
        order.save()
        Order.objects.add_order_to_request(request, order)
        return order



