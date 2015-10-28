from shopengine.utils.backend_pool import BaseBackendPool

from .bacs import PaymentBacs
from .paypal import PaypalPayment

class PaymentBackendPool(BaseBackendPool):
    CONSTANT_SETTINGS = 'SHOP_PAYMENT_BACKENDS'

payment_backend_pool = PaymentBackendPool()
