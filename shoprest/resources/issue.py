from shoprest.api import api
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS

from shoprest.authorization import CheckOnlyDangerous
from shoprest.authentication import SessionCheckDangerous

from shopengine.models import Issue

class IssueResource(ModelResource):
    class Meta:
        queryset = Issue.objects.all()
        allowed_methods = ['get', 'post', 'put']
        resource_name = 'issue'
        always_return_data = True
        filtering = {
            'replies': ALL_WITH_RELATIONS
        }
        authentication = SessionCheckDangerous()
        authorization = CheckOnlyDangerous()



api.register(IssueResource())
