import os
from django.conf import settings

USER_SETTINGS = getattr(settings, 'SHOPIE', {})

MEDIA_ROOT = getattr(settings, 'MEDIA_ROOT', None)

DEFAULTS = {
    'PAYMENT_BACKENDS': [
        'shopie.payment.backends.bacs.PaymentBacs',
        'shopie.payment.backends.paypal.PaypalStandard'
    ],
    'PRODUCT_UPLOAD_DIR': os.path.join(MEDIA_ROOT, 'product_upload')
}

class _ShopieSettings(dict):

    def __missing__(self, key):
        if key not in DEFAULTS.keys():
            raise KeyError("Thats not valid settings for shopie")
        return DEFAULTS[key]

class ShopieSettings(object):

    def __init__(self, settings=USER_SETTINGS):
        self._settings = _ShopieSettings(settings)

    def __getattr__(self, attr):
        try:
            return super(ShopieSettings, self).__getattr__(attr)
        except AttributeError:
            return self._settings[attr]

shopie_settings = ShopieSettings()
