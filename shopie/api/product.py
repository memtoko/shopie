from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext as _

from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework_json_api.mixins import MultipleIDMixin
from rest_framework.response import Response
from rest_framework import permissions as restpermission
from rest_framework.permissions import BasePermission, AllowAny, SAFE_METHODS

from shopie.models import Product
from shopie.api.serializers.product import ProductSerializer

class ReadOnlyOrAuthor(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff or request.user == obj.author

class ProductViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'products'
    permission_classes = (ReadOnlyOrAuthor,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        request, queryset = self.request, self.queryset
        if request.user.is_staff:
            queryset = queryset.all()
        else:
            queryset = queryset.published().active()
        return queryset
