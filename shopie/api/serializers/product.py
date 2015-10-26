from rest_framework import serializers

from shopie.models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'slug',
            'short_description',
            'description',
            'image',
            'author',
            'unit_price',
            'is_active',
            'status',
            'parent',
        )
