from .common import *

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
SITE_ID = 1
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'django',
        'USER': 'django',
        'PASSWORD': 'nindyaeka81',
        'HOST': 'localhost',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',
    }
}
