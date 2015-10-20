from django.contrib.auth import get_user_model

from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
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

class SetPasswordSerializer(serializers.Serializer):
    new_password1 = serializers.CharField()
    new_password2 = serializers.CharField()

    def validate(self, data):
        try:
            new_password1 = data['new_password1']
            new_password2 = data['new_password2']
        except KeyError:
            raise serializers.ValidationError("new password need to pass both")
        if new_password1 and new_password2:
            if new_password1 != new_password2:
                raise serializers.ValidationError("The two password fields didn't match.")
        return data

class UserRegistrationSerializer(SetPasswordSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value):
            raise serializers.ValidationError("This email address is already in use. Please supply a different email address.")
        return value

    def validate_username(self, value):
        # all username is lower
        value = value.lower()
        if User.objects.filter(username__iexact=value):
            raise serializers.ValidationError("This username is not available")
        return value

class PasswordReset(serializers.Serializer):
    email = serializer.EmailField(required=True)
