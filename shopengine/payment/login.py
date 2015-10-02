from django.utils.decorators import method_decorator
from django.utils.translation import ugettext_lazy as _
from django.views.generic.edit import FormView
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.forms import AuthenticationForm
from registration.forms import RegistrationForm
from registration import signals as registration_signal

from shopengine.decorators import cart_nonempty_required
from .checkout import CheckoutStepMixin
from django.contrib.auth import login as auth_login

class CheckoutLoginStep(CheckoutStepMixin, FormView):
    identifier = "login"
    title = _("Login or Create")
    template_name = "shopengine/checkout/login.html"
    form_class = AuthenticationForm

    def form_valid(self, request, form):
        auth_login(request, form.get_user())
        return super(CheckoutLoginStep, self).form_valid(request, form)

    def is_valid(self):
        return self.request.user and not isinstance(self.request.user, AnonymousUser)

    def process(self):
        pass
