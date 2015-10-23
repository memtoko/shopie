from decimal import Decimal
from django.test import TestCase

from shopie.models import Product

class SimpleProductModelTests(TestCase):

    def setUp(self):
        Product.objects.create(
            name="Foo Product", #the slug should be foo-product
            short_description="foo short description",
            description="foo description",
            unit_price=Decimal('22.05'),
            is_active=True,
            status=Product.STATUS_PUBLISHED
        )

    def test_get_product_from_slug(self):
        self.assertIsNotNone(Product.objects.get(slug='foo-product'))
        with self.assertRaises(Product.DoesNotExist):
            Product.objects.get(slug='invalid-slug')

    def test_it_orderable(self):
        product = Product.objects.all()[0]
        print(product.status)
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

    def setUp(self):
        Product.objects.create(
            name="Foo Product", #the slug should be foo-product
            short_description="foo short description",
            description="foo description",
            unit_price=Decimal('22.05'),
            is_active=True,
            status=Product.STATUS_PUBLISHED
        )
        parent = Product.objects.get(slug='foo-product')
        Product.objects.create(
            name="Variant Foo Product", #the slug should be foo-product
            short_description="variant foo short description",
            description="variant foo description",
            unit_price=Decimal('25.22'),
            is_active=True,
            status=Product.STATUS_PUBLISHED,
            parent=parent
        )
        Product.objects.create(
            name="Variant Foo Product 2", #the slug should be foo-product
            short_description="variant foo short description 2",
            description="variant foo description 2",
            unit_price=Decimal('27.22'),
            is_active=True,
            status=Product.STATUS_PUBLISHED,
            parent=parent
        )

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

