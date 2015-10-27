from .product import urlpatterns as product_urlpatterns
from .issue import urlpatterns as issue_urlpatterns
from .api import urlpatterns as api_url_patterns

urlpatterns  = product_urlpatterns
urlpatterns += issue_urlpatterns
urlpatterns += api_url_patterns
