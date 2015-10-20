from django.conf.urls import patterns, url
from shopengine.views.cart import CartView, CartItemDetail, DisscountView

urlpatterns = patterns('',
    url(r'^cart/delete/$', CartView.as_view(action='delete'),  # DELETE
        name='cart_delete'),
    url(r'^cart/item/$', CartView.as_view(action='post'),  # POST
        name='cart_item_add'),
    url(r'^cart/$', CartView.as_view(), name='cart'),  # GET
    url(r'^cart/update/$', CartView.as_view(action='put'),
        name='cart_update'),

    # CartItems
    url(r'^cart/item/(?P<id>[0-9]+)$', CartItemDetail.as_view(),
        name='cart_item'),
    url(r'^cart/item/(?P<id>[0-9]+)/delete$',
        CartItemDetail.as_view(action='delete'),
        name='cart_item_delete'),
    url(r'^cart/disscount/$', DisscountView.as_view(action='post'),
        name='cart_disscount_add')
)
