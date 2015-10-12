from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext as _

from rest_framework import viewsets

from rest_framework_json_api.mixins import MultipleIDMixin

from shoprest.serializers.user import UserSerializer
from shoprest.permissions import IsAuthenticatedOrReadOnly, AdminOrOwnerPermission

class UserViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'users'
    permission_classes = (AdminOrOwnerPermission,)
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
