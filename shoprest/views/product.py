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
from shopengine.models import Product

from shoprest.serializers.product import ProductSerializer
from shoprest.permissions import ReadOnlyOrOwner

class ProductViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'products'
    permission_classes = (ReadOnlyOrOwner,)
    queryset = Product.objects.exclude(product_type=Product.VARIANT_PRODUCT)
    serializer_class = ProductSerializer

    def get_queryset(self):
        request, queryset = self.request, self.queryset
        if request.user.is_staff:
            queryset = queryset.all()
        else:
            queryset = queryset.published().active().select_related("parent")
        return queryset
