from rest_framework import serializers

from shopengine.models import Product

class ProductSerializer(serializers.ModelSerializer):
	class Meta:
		model = Product
		fields = (
			'id',
			'name',
			'slug',
			'meta_description',
			'short_description',
            'description',
            #'image',
            #'thumbnail',
            'author',
            'unit_price',
            'is_active',
            'product_type',
            #'parent',
		)
