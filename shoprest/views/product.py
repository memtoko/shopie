from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext as _

from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework_json_api.mixins import MultipleIDMixin
from rest_framework.response import Response

from shopengine.models import Product

from shoprest.serializers.product import ProductSerializer
from shoprest.permissions import ReadOnlyOrOwner

class ProductViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'products'
    permission_classes = (ReadOnlyOrOwner,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
