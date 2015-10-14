from django.conf.urls import patterns, url, include

from .router import router

from .views.user import UserViewSet
from .views.cart import CartViewSet, CartItemViewSet
from .views.product import ProductViewSet

router.register(r'users', UserViewSet)
router.register(r'products', ProductViewSet)
router.register(r'carts', CartViewSet)
router.register(r'cart_items', CartItemViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls))
)

