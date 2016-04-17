from django.conf.urls import url
from shopie.views.current_order import CurrentOrderItem, CurrentOrderView

urlpatterns = [
    url(r'^cart/delete/$', CurrentOrderView.as_view(action='delete'),  # DELETE
        name='cart_delete'),
    url(r'^cart/item/$', CurrentOrderView.as_view(action='post'),  # POST
        name='cart_item_add'),
    url(r'^cart/$', CurrentOrderView.as_view(), name='cart'),  # GET
    url(r'^cart/update/$', CurrentOrderView.as_view(action='put'),
        name='cart_update'),

    # CartItems
    url(r'^cart/item/(?P<id>[0-9]+)$', CurrentOrderItem.as_view(),
        name='cart_item'),
    url(r'^cart/item/(?P<id>[0-9]+)/delete$',
        CurrentOrderItem.as_view(action='delete'),
        name='cart_item_delete'),
]
