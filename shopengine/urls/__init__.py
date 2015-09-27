from .cart import urlpatterns as cart_urlpatterns
from .product import urlpatterns as product_urlpatterns

urlpatterns = cart_urlpatterns
urlpatterns += product_urlpatterns
