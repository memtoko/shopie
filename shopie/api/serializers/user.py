from django.contrib.auth import get_user_model
from .base import ModelSerializer, ValidationError, EmailField

User = get_user_model()

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'email',
            'username',
            'date_joined',
        )
