from django.conf.urls import url, include

from . import payment_backend_pool

# For every backend defined in the backend pool, load all the URLs it defines
# in its get_urls
backends = payment_backend_pool.get_backend_list()
urlpatterns = [url('^gates/%s/' % x.url_namespace, include(x.get_urls())) for x in backends if x.get_urls() is not None]
