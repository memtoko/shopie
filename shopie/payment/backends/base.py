from decimal import Decimal

from shopengine.models import Order, Payment
from shopengine.utils.text import create_sha1_key

class PaymentBackendBase(object):

    backend_name = None

    def get_urls(self):
        raise NotImplementedError

    def _create_transaction_id(self, order):
        key = str(order.pk) + str(order.cart_pk) + '-' + self.backend_name
        return create_sha1_key(key)
