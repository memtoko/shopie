from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext as _

from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework_json_api.mixins import MultipleIDMixin

from shoprest.serializers.user import UserSerializer
from shoprest.permissions import IsAuthenticatedOrReadOnly, AdminOrOwnerPermission

def allow_self_only(user, pk, message):
    if user.is_anonymous():
        raise PermissionDenied(
            _("You have to sign in to perform this action."))
    if user.pk != int(pk):
        raise PermissionDenied(message)

class UserViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'users'
    permission_classes = (AdminOrOwnerPermission,)
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        if pk == 'me':
            pk = request.user.pk
        return super(UserViewSet, self).retrieve(request, pk)
