from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import ugettext_lazy as _

from registration.backends.simple.views import RegistrationView

from .checkout import CheckoutStepMixin

class RegisterCheckoutProcess(CheckoutStepMixin, RegistrationView):
    identifier = "register"
    title = _('Daftar')

    def should_skip(self):
        return self.request.user and not isinstance(self.request.user, AnonymousUser)

    def get_success_url(self):
        if self.next_step:
            return reverse("checkout", kwargs={"step": self.next_step.identifier})

    def process(self): pass

