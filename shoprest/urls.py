from django.conf.urls import url, include

from .api import api
import shoprest.resources

urlpatterns = [
    url(r'^api/', include(api.urls)),
]
