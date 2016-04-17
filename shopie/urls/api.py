from django.conf.urls import url, include

from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers

from shopie.api.user import UserViewSet
from shopie.api.product import ProductViewSet, ProductTagViewSet
from shopie.api.order import OrderViewSet, OrderItemViewSet
from shopie.api.media import MediaViewSet

# use the default one
router = routers.DefaultRouter()

router.register('users', UserViewSet)
router.register('products', ProductViewSet)
router.register('tags', ProductTagViewSet)
router.register('orders', OrderViewSet)
router.register('order-items', OrderItemViewSet)
router.register('media', MediaViewSet)

urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
]
