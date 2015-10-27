from django.conf import settings

USER_SETTINGS = getattr(settings, 'SHOPIE', None)

DEFAULTS = {
    'PAYMENT_BACKENDS': [
        'shopie.payment.backends.bacs.PaymentBacs',
        'shopie.payment.backends.paypal.PaypalStandard'
    ]
}

class _ShopieSettings(dict):

    def __missing__(self, key):
        if key not in DEFAULTS.keys():
            raise KeyError("Thats not valid settings for shopie")
        return DEFAULTS[key]

shopie_settings = _ShopieSettings(USER_SETTINGS)
