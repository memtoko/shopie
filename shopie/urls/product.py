from django.conf.urls import url
from shopie.views.product import (ShopView, ShopDetailView)

urlpatterns = [
	url(r'^$', ShopView.as_view(), name="shop"), # shop index
    url(r'^product/(?P<slug>[^\.]+)-(?P<pk>\d+)/$', ShopDetailView.as_view(),
        name='product_detail')
]
