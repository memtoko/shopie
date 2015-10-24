from decimal import Decimal
from django.test import TestCase

from shopie.models import Product

class SimpleProductModelTests(TestCase):
    fixtures = ['product_simple_test_data']

    def test_get_product_from_slug(self):
        self.assertIsNotNone(Product.objects.get(slug='foo-product'))
        with self.assertRaises(Product.DoesNotExist):
            Product.objects.get(slug='invalid-slug')

    def test_it_orderable(self):
        product = Product.objects.all()[0]
        self.assertTrue(product.orderable)

    def test_it_not_orderable_if_not_active(self):
        product = Product.objects.all()[0]
        product.is_active = False
        self.assertFalse(product.orderable)

    def test_it_not_orderable_if_not_published(self):
        product = Product.objects.all()[0]
        product.status = Product.STATUS_DRAFT
        self.assertFalse(product.orderable)

class VariableProduct(TestCase):
    fixtures = ['product_variant_test_data']

    def test_parent_has_variant(self):
        parent = Product.objects.get(slug='foo-product')
        self.assertTrue(parent.has_variant)
        self.assertTrue(parent.is_parent)

    def test_parent_product_is_not_orderable(self):
        """A parent product is not orderable"""
        parent = Product.objects.get(slug='foo-product')
        self.assertFalse(parent.orderable)

    def test_parent_price(self):
        """parent price take the lowest price in the variants, however parent
        product is not orderable, basically if you access price on parent, i assume
        it just for display."""
        parent = Product.objects.get(slug='foo-product')
        self.assertEqual(parent.price, Decimal('25.22'))

    def test_variant_is_orderable(self):
        product = Product.objects.get(slug='variant-foo-product')
        self.assertTrue(product.orderable)

    def test_variant_price(self):
        #variant price
        product = Product.objects.get(slug='variant-foo-product')
        self.assertEqual(product.price, Decimal('25.22'))

