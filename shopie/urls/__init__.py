from .product import urlpatterns as product_urlpatterns
from .issue import urlpatterns as issue_urlpatterns
from .api import urlpatterns as api_urlpatterns
from .admin import urlpatterns as admin_urlpatterns

urlpatterns  = product_urlpatterns
urlpatterns += issue_urlpatterns
urlpatterns += api_urlpatterns
urlpatterns += admin_urlpatterns
