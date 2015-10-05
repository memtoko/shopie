from django.conf.urls import patterns, url

from shopengine.views.checkout import CheckoutView

urlpatterns = patterns('',
        url(r'^checkout/$', CheckoutView.as_view(), name='checkout'),
        url(r'^checkout/(?P<step>.+)/$', CheckoutView.as_view(), name='checkout')
    )
