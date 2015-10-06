from .api import api
from jsonapi.resource import Resource

from shopengine.utils.users import user_model_string
User = user_model_string()

@api.register
class UserResource(Resource):
    class Meta:
        model = User
        allowed_methods = ['GET', 'POST']
        
