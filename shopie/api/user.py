from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import AnonymousUser
from django.views.decorators.csrf import csrf_protect

from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import detail_route, list_route
from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny, SAFE_METHODS

from rest_framework_json_api.mixins import MultipleIDMixin

from shopie.api.endpoints.user import (create_endpoint, password_reset_endpoint,
    change_password_endpoint)
from shopie.api.serializers.user import UserSerializer

class UserPermissions(BasePermission):
    """Permission class for user viewset, only allow user to edit their profile
    and or user staff.
    """
    def has_object_permission(self, request, view, obj):
        return request.user == obj or request.user.is_staff

class UserViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'users'
    permission_classes = (UserPermissions,)
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def create(request):
        return create_endpoint(request)

    @detail_route(methods=['post'])
    def password(self, request, *args, **kwargs):
        user = self.get_object()
        return change_password_endpoint(request, user=user)

    @list_route(methods=['post'], permission_classes=[])
    @csrf_protect
    def passwordreset(self, request, *args, **kwargs):
        user = request.user
        if user and isinstance(user, AnonymousUser):
            return Response({
                'error': {
                    'errors': [
                        'You cant reset password when still authenticated.'
                    ]
                }
            })
        return password_reset_endpoint(request)

    @list_route(methods=['get'], permission_classes=(IsAuthenticated,))
    def me(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.serializer_class(user, many=False)
        return Response(serializer.data, status=200)

    @detail_route(methods=['get'], permission_classes=(UserPermissions,))
    def staff(self, request, *args, **kwargs):
        obj = self.get_object()
        return Response({
            'is_staff': obj.is_staff
        })
