from django.conf.urls import url
from shopie.views.checkout import DefaultCheckoutView

urlpatterns = [
    url(r'^checkout/$', DefaultCheckoutView.as_view(), name='checkout'),
    url(r'^checkout/(?P<step>.+)/$', DefaultCheckoutView.as_view(), name='checkout'),
]
