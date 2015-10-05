from .cart import urlpatterns as cart_urlpatterns
from .product import urlpatterns as product_urlpatterns
from .checkout import urlpatterns as checkout_urlpatterns
from .issue import urlpatterns as issue_urlpatterns
from shopengine.payment.backends.urls import urlpatterns as payment_backends_urls

urlpatterns = cart_urlpatterns
urlpatterns += product_urlpatterns
urlpatterns += checkout_urlpatterns
urlpatterns += payment_backends_urls
urlpatterns += issue_urlpatterns
