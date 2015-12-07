from .base import ModelSerializer

from shopie.models import Product, ProductTag

class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'slug',
            'created_at',
            'updated_at',
            'short_description',
            'description',
            'image',
            'author',
            'unit_price',
            'is_active',
            'status',
            'parent',
            'tags'
        )

class ProductTagSerializer(ModelSerializer):
    class Meta:
        model = ProductTag
        fields = (
            'id',
            'name',
            'description',
            'slug',
            'image',
            'updated_at',
            'created_at',
            'products'
        )
