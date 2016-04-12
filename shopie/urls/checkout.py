from django.conf.urls import patterns, url
from shopie.views.checkout import DefaultCheckoutView

urlpatterns = patterns('',
    url(r'^checkout/$', DefaultCheckoutView.as_view(), name='checkout'),
    url(r'^checkout/(?P<step>.+)/$', DefaultCheckoutView.as_view(), name='checkout'),
)
