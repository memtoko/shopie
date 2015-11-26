from django.apps import AppConfig
from shopie.payment.backends.signals import connect as payment_backend_conn

class ShopieConfig(AppConfig):
    name = 'shopie'
    label = 'shopie'
    verbose_name = "Shopie"

    def ready(self):
        payment_backend_conn()
