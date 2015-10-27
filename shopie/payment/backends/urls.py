from django.conf.urls import patterns, include

from . import payment_backend_pool

urlpatterns = patterns('')

# For every backend defined in the backend pool, load all the URLs it defines
# in its get_urls() method.
for backend in payment_backend_pool.get_backend_list():
    regexp = '^%s/' % backend.url_namespace
    # trap the backend that doesn't implement get_urls methods.
    try:
        urls = backend.get_urls()
    except NotImplementedError:
        continue
    pattern = patterns('',
        (regexp, include(backend.get_urls()))
    )

    urlpatterns = pattern + urlpatterns
