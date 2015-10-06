from .common import *

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
SITE_ID = 1
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'django.db',
        'USER': 'django',
        'PASSWORD': 'hahaha',
        'HOST': 'localhost',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',
    }
}

PAYPAL_PAYMENT_SANDBOX = True
