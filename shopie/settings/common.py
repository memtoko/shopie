# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '&d+cpgq0tg-0&lbxidvx#z_h715==hnbw2itpw-!vyu#9a-4mj'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []
LOGIN_URL = '/account/login/'

# Application definition

INSTALLED_APPS = [
    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'oauth2_provider',
    'rest_framework',
    'registration',
    'account',
    'shopengine',
    'shoprest',
]

MIDDLEWARE_CLASSES = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
]

ROOT_URLCONF = 'shopie.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
                    os.path.join(PROJECT_DIR, 'templates')
                ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'shopengine.context_processors.cart'
            ],
        },
    },
]

WSGI_APPLICATION = 'shopie.wsgi.application'

SHOP_PAYMENT_BACKENDS = [
    'shopengine.payment.backends.bacs.PaymentBacs',
    'shopengine.payment.backends.paypal.PaypalBackendPaymentStandard'
]

SHOP_CART_MODIFIERS = [

]


PAYPAL_API_CLIENT_ID = 'ATeG27lpmYgwViZzVfYli3o_HxKxuYruSpGBMfEXJaEI3PaLDuUkqogS22dnRGvdjhYkzKj6cilY9SY5'
PAYPAL_API_SECRET = 'EMlFuDt2jjRGZ62o9VmvDtBn_cKtERNjLpeeiEybVEHXhRARs_1Gerl2aTbswQStuvV1sa6UUgBcNPDW'

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = PROJECT_DIR
STATICFILES_DIRS = (os.path.join(PROJECT_DIR, 'static'),)

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(PROJECT_DIR, 'media')

REST_FRAMEWORK = {
    'PAGINATE_BY': 10,
    'PAGINATE_BY_PARAM': 'page_size',
    'MAX_PAGINATE_BY': 100,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.ext.rest_framework.OAuth2Authentication',
    ),
    # DRF v3.1+
    'DEFAULT_PAGINATION_CLASS':
        'rest_framework_json_api.pagination.PageNumberPagination',
    # older than DRF v3.1
    'DEFAULT_PAGINATION_SERIALIZER_CLASS':
        'rest_framework_json_api.pagination.PaginationSerializer',
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework_json_api.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework_json_api.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
}

JSON_API_FORMAT_KEYS = 'dasherize'
JSON_API_FORMAT_RELATION_KEYS = 'dasherize'
JSON_API_PLURALIZE_RELATION_TYPE = True
