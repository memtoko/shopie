from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext as _

from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework_json_api.mixins import MultipleIDMixin
from rest_framework.response import Response

from shopengine.models import Cart, CartItem
from shopengine.cart.bucket import get_or_create_cart, get_cart_from_database

from shoprest.serializers.cart import CartSerializer, CartItemSerializer
from shoprest.permissions import ReadOnlyOrOwner

class CartViewMixin:

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            for p in page:
                p.update(request)
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        instance = self.get_object()
        instance.update(request)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CartViewSet(MultipleIDMixin, CartViewMixin, viewsets.ModelViewSet):
    resource_name = 'carts'
    permission_classes = (ReadOnlyOrOwner,)
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def get_queryset(self):
        request = self.request
        if request.user.is_anonymous():
            cart = get_or_create_cart(request)
            return Cart.objects.filter(pk=cart.pk)
        else:
            if request.user.is_staff:
                return Cart.objects.all()
            return Cart.objects.filter(user=request.user).select_related('user')

    def retrieve(self, request, pk=None):
        if pk == 'current':
            pk = get_or_create_cart(request, save=True).pk
        return super(CartViewSet, self).retrieve(request, pk)

class CartItemViewSet(MultipleIDMixin, CartViewMixin, viewsets.ModelViewSet):
    resource_name = 'cart-items'
    permission_classes = (ReadOnlyOrOwner,)
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
