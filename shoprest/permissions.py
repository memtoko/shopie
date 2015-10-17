from rest_framework.permissions import BasePermission, AllowAny, SAFE_METHODS

from django.core.exceptions import PermissionDenied
from django.utils.translation import ugettext as _

__all__ = [
    'BasePermission',
    'IsAuthenticatedOrReadOnly',
    'AdminOrOwnerPermission',
    'ReadOnlyOrOwner'
]

class IsAuthenticatedOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous() and request.method not in SAFE_METHODS:
            raise PermissionDenied(
                _("This action is not available to guests."))
        else:
            return True


class AdminOrOwnerPermission(BasePermission):
    """Permission class that only allow user is staff or the object provided
    is the owner.
    """
    def has_permission(self, request, view):
        if request.user.is_anonymous():
            raise PermissionDenied(
                    _("Sory action not available for guests"))
        else:
            return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_anonymous():
            raise PermissionDenied(
                    _("Sory this action not available for guests")
                )
        if request.user.is_staff:
            return True
        else:
            return request.user == obj.user

class ReadOnlyOrOwner(BasePermission):


    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff or request.user == obj.user
