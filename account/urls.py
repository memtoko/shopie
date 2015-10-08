from django.conf.urls import url, include

from registration.forms import RegistrationFormUniqueEmail
from registration.backends.default.views import RegistrationView

from .views import user_dashboard

urlpatterns = [
    url(
        r'^register/$',
        RegistrationView.as_view(form_class=RegistrationFormUniqueEmail),
        name='registration_register',
    ),
    url(r'^(?P<username>.+)/$', user_dashboard, name='account_dashboard'),
    url(r'', include('django.contrib.auth.urls')),
    url(r'', include('registration.backends.default.urls')),
]
