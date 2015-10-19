from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext as _

from rest_framework import viewsets
from rest_framework import status as httpstatus
from rest_framework.decorators import detail_route, list_route
from rest_framework_json_api.mixins import MultipleIDMixin
from rest_framework.permissions import BasePermission, AllowAny, SAFE_METHODS

from shoprest.serializers.user import UserSerializer, SetPasswordSerializer
from shoprest.permissions import IsAuthenticatedOrReadOnly, AdminOrOwnerPermission

def allow_self_only(user, pk, message):
    if user.is_anonymous():
        raise PermissionDenied(
            _("You have to sign in to perform this action."))
    if user.pk != int(pk):
        raise PermissionDenied(message)

class UserPermissions(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj or request.user.is_staff

class UserViewSet(MultipleIDMixin, viewsets.ModelViewSet):
    resource_name = 'users'
    permission_classes = (UserPermissions,)
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        if pk == 'me':
            pk = request.user.pk
        return super(UserViewSet, self).retrieve(request, pk)

    @detail_route(methods='post')
    def changepassword(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = SetPasswordSerializer(data=request.data)
        check_old_pass = user.check_password(data['old_password'])
        if all(check_old_pass, serializer.is_valid()):
            user.set_password(serializer.data['new_password2'])
            user.save()
            return Response({
                'status': {
                    'success': 'Password set'
                }
            })
        else:
            return Response(serializer.errors, status=httpstatus.HTTP_400_BAD_REQUEST)
