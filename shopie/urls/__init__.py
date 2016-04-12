from .product import urlpatterns as product_urlpatterns
from .issue import urlpatterns as issue_urlpatterns
from .api import urlpatterns as api_urlpatterns
from .admin import urlpatterns as admin_urlpatterns
from .account import urlpatterns as account_url_pattern
from .cart import urlpatterns as cart_url_pattern
from .checkout import urlpatterns as checkout_url_pattern
from shopie.payment.backends.urls import urlpatterns as payment_url_pattern

urlpatterns  = product_urlpatterns
urlpatterns += issue_urlpatterns
urlpatterns += api_urlpatterns
urlpatterns += admin_urlpatterns
urlpatterns += account_url_pattern
urlpatterns += cart_url_pattern
urlpatterns += checkout_url_pattern
urlpatterns += payment_url_pattern
