from .api import api
from tastypie.authorization import Authorization
from tastypie import fields
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS

from shopengine.utils.users import user_model
User = user_model()

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = ['password', 'is_superuser', 'is_staff']
        filtering = {
            'username': ALL
        }

api.register(UserResource())
