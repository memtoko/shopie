from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.forms import AuthenticationForm

from registration.backends.simple.views import RegistrationView
from registration.forms import RegistrationFormUniqueEmail

from .checkout import CheckoutStepMixin

class AuthCheckoutStep(CheckoutStepMixin, RegistrationView):
    identifier = "auth"
    title = _('Daftar atau Login')
    form_class = RegistrationFormUniqueEmail
    template_name = "shopie/checkout/auth.html"

    def get_context_data(self, **kwargs):
        ctx = super(AuthCheckoutStep, self).get_context_data(**kwargs)
        ctx.update({
            'auth_form': AuthenticationForm()
        })
        return ctx

    def should_skip(self):
        return self.request.user and not isinstance(self.request.user, AnonymousUser)

    def get_success_url(self):
        if self.next_step:
            return reverse("checkout", kwargs={"step": self.next_step.identifier})

    def process(self): pass
