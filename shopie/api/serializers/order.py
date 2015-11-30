from .base import ModelSerializer, ResourceRelatedField
from shopie.models import (
    Order, OrderItem, ExtraPriceOrderField, ExraPriceOrderItemField)

class OrderSerializer(ModelSerializer):
    extra_price_fields = ResourceRelatedField(many=True, required=False,
        queryset=ExtraPriceOrderField.objects.all())
    items = ResourceRelatedField(many=True, required=False,
        queryset=OrderItem.objects.all())

    class Meta:
        model = Order
        fields = (
            'id',
            'number',
            'status',
            'full_name',
            'email',
            'user',
            'received_at',
            'order_key',
            'order_subtotal',
            'order_total',
            'created_at',
            'updated_at',
            'accepted_at',
            'accepted_by',
            'rejected_at',
            'rejected_by',
            'items',
            'extra_price_fields'
        )

class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = OrderItem
        fields = (
            'id',
            'order',
            'product',
            'unit_price',
            'quantity',
            'line_subtotal',
            'line_total',
            'extra_price_fields'
        )

class ExtraPriceOrderFieldSerializer(ModelSerializer):
    class Meta:
        model = ExtraPriceOrderField
        fields = (
            'id',
            'order',
            'label',
            'value'
        )

class ExraPriceOrderItemFieldSerializer(ModelSerializer):
    class Meta:
        model = ExraPriceOrderItemField
        fields = (
            'id',
            'order_item',
            'label',
            'value'
        )
