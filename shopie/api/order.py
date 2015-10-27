from django.core.exceptions import PermissionDenied

from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import detail_route, list_route

from rest_framework_json_api.mixins import MultipleIDMixin

from shopie.models import Order, OrderItem
from shopie.api.serializers.order import OrderSerializer, OrderItemSerializer

class OrderViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'orders'
    permission_classes = (IsAuthenticated,)
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        """Filter the queryset for current logged in user"""
        user = self.request.user
        return self.queryset.filter(user=user)

class OrderItemViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'order-items'
    permission_classes = (IsAuthenticated,)
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        user = self.request.user
        return self.queryset.fiter(order___user=user)
