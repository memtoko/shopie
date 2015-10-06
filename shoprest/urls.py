from django.conf.urls import url, include

from .api import api
from .views import *

urlpatterns = [
    url(r'^api/', include(api.urls)),
]
