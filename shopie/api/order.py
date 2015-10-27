from django.core.exceptions import PermissionDenied

from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import detail_route, list_route

from rest_framework_json_api.mixins import MultipleIDMixin

from shopie.models import Order
from shopie.api.serializers.order import OrderSerializer

class OrderViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'orders'
    permission_classes = (IsAuthenticated,)
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        """Filter the queryset for current logged in user"""
        user = self.request.user
        return self.queryset.filter(user=user)
