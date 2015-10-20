from rest_framework import serializers

from shopengine.models import Cart, CartItem
from shopengine.utils.formatting import moneyfmt

class CartSerializer(serializers.ModelSerializer):
    extra_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = (
            'id',
            'user',
            'items',
            'extra_price',
            'created_at',
            'updated_at',
        )

    def get_extra_price(self, obj):
        out = {}
        for item in obj.extra_price_fields:
            out[item[0]] = moneyfmt(item[1])
        return out

class CartItemSerializer(serializers.ModelSerializer):
    extra_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            'id',
            'quantity',
            'extra_price',
            'product',
            'cart',
        )

    def get_extra_price(self, obj):
        out = {}
        for item in obj.extra_price_fields:
            out[item[0]] = moneyfmt(item[1])
        return out
