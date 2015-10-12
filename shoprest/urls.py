from django.conf.urls import patterns, url, include

from .router import router

from .views.user import UserViewSet

router.register(r'users', UserViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls))
)

