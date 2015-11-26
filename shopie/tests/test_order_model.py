from decimal import Decimal
from django.test import TestCase

from shopie.models import Product, Order

class OrderModelTest(TestCase):
    fixtures = ['product_simple_test_data', 'order_test_data']

    def test_initial_order_is_empty(self):
        order = Order.objects.get(pk=1)
        self.assertTrue(order.is_empty)

    def test_add_item_order_is_not_empty(self):
        order = Order.objects.get(pk=1)
        product = Product.objects.get(pk=1)

        order.add_item(product)
        self.assertFalse(order.is_empty)

    def test_order_can_create_with_empty_param(self):
        order = Order()
        order.save()

        self.assertTrue(order.pk is not None)

    def test_add_item(self):
        order = Order.objects.get(pk=1)
        product = Product.objects.get(pk=1)

        order.add_item(product)
        self.assertTrue(order.has_item)
        self.assertEqual(order.total_items, 1)

    def test_calculate_method(self):
        order = Order.objects.get(pk=1)
        product = Product.objects.get(pk=1)
        order.add_item(product)
        # because the quantity is 0
        self.assertEqual(order.order_total, product.price)

    def test_update_quantity(self):
        order = Order.objects.get(pk=1)
        product = Product.objects.get(pk=1)
        item = order.add_item(product)

        order.update_quantity(2, order_item=item)

        self.assertEqual(order.total_items, 2)
        self.assertEqual(order.order_total, product.price * 2)
