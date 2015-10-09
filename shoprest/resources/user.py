from shoprest.api import api
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.authentication import SessionAuthentication
from tastypie.authorization import DjangoAuthorization

from shopengine.utils.users import user_model
User = user_model()

class UserResource(ModelResource):
    class Meta:
        allowed_methods = ['get']
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = ['password', 'is_superuser', 'is_staff']
        always_return_data = True
        filtering = {
            'username': ALL
        }

api.register(UserResource())
