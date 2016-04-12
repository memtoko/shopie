from shopie.utils.backend_pool import BaseBackendPool

from .bacs import PaymentBacs
from .paypal import PaypalPayment

class PaymentBackendPool(BaseBackendPool):
    CONSTANT_SETTINGS = 'PAYMENT_BACKENDS'

payment_backend_pool = PaymentBackendPool()

def get_backend_by_name(name):
    for backend in payment_backend_pool.get_backend_list():
        if backend.backend_name == name:
            return backend
    return False
