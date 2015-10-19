from django.contrib.auth import get_user_model

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'first_name',
            'last_name',
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
