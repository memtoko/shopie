from rest_framework import serializers

from shopengine.models import Cart, CartItem
from shopengine.utils.formatting import moneyfmt

class CartSerializer(serializers.ModelSerializer):
    subtotal_price = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    extra_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = (
            'id',
            'user',
            'items',
            'subtotal_price',
            'total_price',
            'extra_price',
            'created_at',
            'updated_at',
        )

    def get_subtotal_price(self, obj):
        return moneyfmt(obj.subtotal_price)

    def get_total_price(self, obj):
        return moneyfmt(obj.total_price)

    def get_extra_price(self, obj):
        out = {}
        for item in obj.extra_price_fields:
            out[item[0]] = moneyfmt(item[1])
        return out

class CartItemSerializer(serializers.ModelSerializer):
    line_subtotal = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()
    extra_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            'id',
            'quantity',
            'line_total',
            'line_subtotal',
            'extra_price',
            'product',
            'cart',
        )

    def get_line_subtotal(self, obj):
        return moneyfmt(obj.line_subtotal)

    def get_line_total(self, obj):
        return moneyfmt(obj.line_total)

    def get_extra_price(self, obj):
        out = {}
        for item in obj.extra_price_fields:
            out[item[0]] = moneyfmt(item[1])
        return out
