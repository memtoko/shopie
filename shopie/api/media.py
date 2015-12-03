from django.core.exceptions import PermissionDenied

from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework_json_api.mixins import MultipleIDMixin
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, AllowAny, SAFE_METHODS

from shopie.models import Media
from shopie.api.serializers.media import MediaSerializer

class ReadOnlyOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff or request.user == obj.owner

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
