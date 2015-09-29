from shopengine.utils.backend_pool import backend_pool

class PaymentBackendPool(BaseBackendPool):
    CONSTANT_SETTINGS = 'SHOP_PAYMENT_BACKENDS'

payment_backend_pool = PaymentBackendPool()
