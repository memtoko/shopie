from django.conf import settings
from django.contrib.sites.models import RequestSite
from django.contrib.sites.models import Site
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordResetForm, PasswordChangeForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.translation import ugettext as _

from registration.models import RegistrationProfile

from registration.forms import RegistrationFormUniqueEmail
from registration import signals
from registration.models import RegistrationProfile

from rest_framework.settings import api_settings
from rest_framework import status
from rest_framework.response import Response

from shopie.api.serializers.user import UserSerializer

SEND_ACTIVATION_EMAIL = getattr(settings, 'SEND_ACTIVATION_EMAIL', True)
FROM_EMAIL = getattr(settings, 'DEFAULT_FROM_EMAIL', None)

def create_endpoint(request):
    form = RegistrationFormUniqueEmail(request.data)
    if form.is_valid():
        if Site._meta.installed:
            site = Site.objects.get_current()
        else:
            site = RequestSite(request)

        new_user_instance = form.save()

        new_user = RegistrationProfile.objects.create_inactive_user(
            new_user=new_user_instance,
            site=site,
            send_email=SEND_ACTIVATION_EMAIL,
            request=request,
        )
        signals.user_registered.send(sender=form.__class__,
                                     user=new_user,
                                     request=request)
        serializer = UserSerializer(new_user, many=False)

        try:
            headers = {'Location': serializer.data[api_settings.URL_FIELD_NAME]}
        except (TypeError, KeyError):
            headers = {}

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

def password_reset_endpoint(request):
    form = PasswordResetForm(request.data)
    if form.is_valid():
        opts = {
            'use_https': request.is_secure(),
            'from_email': FROM_EMAIL,
            'request': request
        }
        form.save(**opts)
        return Response({
            'detail': _("Password change confirmation link " \
                "was sent to your address.")
        })
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

def change_password_endpoint(request, user=None):
    """This endpoint require user to type old password in order to change their
    password.
    """
    user = user or request.user
    form = PasswordChangeForm(user=user, data=request.data)
    if form.is_valid():
        form.save()
        #
        update_session_auth_hash(request, form.user)
        return Response({
            'detail': _("Your password has been changed")
        })
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
