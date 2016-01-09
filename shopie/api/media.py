from django.core.exceptions import PermissionDenied

from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework_json_api.mixins import MultipleIDMixin
from rest_framework.response import Response

from shopie.models import Media
from shopie.api.serializers.media import MediaSerializer
from shopie.rest_permissions import ReadOnlyOrOwner

class MediaViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'media'
    permission_classes = (ReadOnlyOrOwner,)
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

    def get_queryset(self):
        request, queryset = self.request, self.queryset
        if request.user.is_staff:
            return queryset.all()
        else:
            return queryset.public()
