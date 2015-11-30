from rest_framework.permissions import BasePermission, AllowAny, SAFE_METHODS

from django.core.exceptions import PermissionDenied
from django.utils.translation import ugettext as _

class ReadOnlyOrOwner(BasePermission):
    """Permission class that only allow owner object to perform CRUD operation.
    It also allow user with is_staff property tru
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff or request.user == obj.user


class UserStaffOnly(BasePermission):

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff
