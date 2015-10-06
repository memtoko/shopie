from django.conf.urls import patterns, url, include

from .api import api

urlpatterns = patterns('',
    url(r'^api/', include(api.urls)))
