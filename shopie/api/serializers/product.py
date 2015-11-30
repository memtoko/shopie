from .base import ModelSerializer

from shopie.models import Product

class ProductSerializer(ModelSerializer):
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
