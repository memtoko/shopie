from django.contrib.auth import get_user_model
from .base import ModelSerializer, ValidationError, EmailField

User = get_user_model()

class UserSerializer(ModelSerializer):
    email = EmailField(required=True, label='Email')
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

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value):
            raise ValidationError("That email already exist!")
        return value
