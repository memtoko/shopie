from django.conf.urls import patterns, url, include

from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers

from shopie.api.user import UserViewSet
from shopie.api.product import ProductViewSet
from shopie.api.order import OrderViewSet, OrderItemViewSet

# use the default one
router = routers.DefaultRouter()

router.register('users', UserViewSet)
router.register('products', ProductViewSet)
router.register('orders', OrderViewSet)
router.register('order-items', OrderItemViewSet)

urlpatterns = patterns('',
    url(r'^api/v1/', include(router.urls)),
)
