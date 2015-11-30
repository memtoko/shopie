from django.core.exceptions import PermissionDenied

from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import detail_route, list_route
from rest_framework.settings import api_settings

from rest_framework_json_api.mixins import MultipleIDMixin

from shopie.models import Order, OrderItem
from shopie.api.serializers.order import OrderSerializer, OrderItemSerializer
from shopie.utils.current_order import get_or_create_current_order
from shopie.rest_permissions import UserStaffOnly

class OrderViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'orders'
    permission_classes = (IsAuthenticated,)
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        """Filter the queryset for current logged in user"""
        user = self.request.user
        if user.is_staff:
            return self.queryset.all()
        return self.queryset.filter(user=user)

    @list_route(methods=['get'])
    def current(self, request, *args, **kwargs):
        obj = get_or_create_current_order(self.request, save=True)
        serializer = OrderSerializer(obj, many=False)
        try:
            headers = {'Location': serializer.data[api_settings.URL_FIELD_NAME]}
        except (TypeError, KeyError):
            headers = {}
        return Response(serializer.data, status=200, headers=headers)

    @detail_route(methods=['post'], permission_classes=[IsAuthenticated,])
    def confirm(self, request, *args, **kwargs):
        order = self.get_object()
        order.confirm()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=200)

    @detail_route(methods=['post'], permission_classes=[IsAuthenticated, UserStaffOnly,])
    def accept(self, request, *args, **kwargs):
        order = self.get_object()
        order.accept(request.user)
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=200)

    @detail_route(methods=['post'], permission_classes=[IsAuthenticated, UserStaffOnly,])
    def reject(self, request, *args, **kwargs):
        order = self.get_object()
        order.reject(request.user)
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=200)

class OrderItemViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'order-items'
    permission_classes = (IsAuthenticated,)
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        user = self.request.user
        return self.queryset.filter(order__user=user)
