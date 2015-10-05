from decimal import Decimal

from shopengine.models import Order, OrderPayment, Cart
from shopengine.utils.text import create_sha1_key
from shopengine.signals.cart import cart_deleted

class PaymentBackendBase(object):

    backend_name = None

    def get_urls(self):
        raise NotImplementedError

    def _create_transaction_id(self, order):
        key = str(order.pk) + str(order.cart_pk) + '-' + self.backend_name
        return create_sha1_key(key)

    def empty_cart(self, order, request):
        try:
            cart = Cart.objects.get(pk=order.cart_pk)
        except Cart.DoesNotExist:
            pass
        else:
            cart_deleted.send(sender=self, request=request, cart=cart)
            cart.empty_cart()

    def create_order_payment(self, order, transaction_id=None, amount=None,
        new_order_status=Order.ON_HOLD):
        if transaction_id is None:
            transaction_id = self._create_transaction_id(order)
        if amount is None:
            amount = Decimal('0.0')
        OrderPayment.objects.create(
            order=order, amount=amount, transaction_id=transaction_id,
            payment_method=self.backend_name)
        order.update_status(new_order_status)
