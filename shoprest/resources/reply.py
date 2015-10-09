from shoprest.api import api
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS

from shoprest.authorization import CheckOnlyDangerous
from shoprest.authentication import SessionCheckDangerous

from shopengine.models import Reply

class IssueResource(ModelResource):
    class Meta:
        allowed_methods = ['get', 'post', 'put']
        queryset = Reply.objects.all()
        resource_name = 'reply'
        always_return_data = True
        filtering = {
            "issue": ALL_WITH_RELATIONS,
        }
        authentication = SessionCheckDangerous()
        authorization = CheckOnlyDangerous()

api.register(IssueResource())
