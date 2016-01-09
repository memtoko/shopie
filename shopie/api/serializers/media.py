from .base import ModelSerializer
from shopie.models import Media

class MediaSerializer(ModelSerializer):
    class Meta:
        model = Media
        fields = (
            'id',
            'name',
            'description',
            'file',
            'user',
            'is_public'
        )
