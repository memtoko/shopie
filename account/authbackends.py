from django.contrib.auth.models import check_password
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailFieldBackend(ModelBackend):
    """Allow authenticate user using their email. This backend also require
    those email is unique."""

    def authenticate(self, username=None, password=None, **kwargs):
        if '@' in username:
            User = get_user_model()
            try:
                user = User.objects.get(email=username)
                if user.check_password(password):
                    return user
            except User.DoesNotExists:
                User().set_password(password)
