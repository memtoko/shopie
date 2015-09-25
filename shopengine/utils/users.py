from django.conf import settings


def user_model():
    try:
        from django.contrib.auth import get_user_model
        return get_user_model()
    except ImportError:
        from django.contrib.auth.models import User
        return User


def user_model_string():
    try:
        return settings.AUTH_USER_MODEL
    except AttributeError:
        return 'auth.User'


def username_field():
    return getattr(UserModel(), 'USERNAME_FIELD', 'username')
