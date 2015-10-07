from django.conf.urls import patterns, url

from shopengine.views.checkout import CheckoutView
from shopengine.payment.backends.urls import urlpatterns as payment_backends_urls

urlpatterns = patterns('',
        url(r'^checkout/$', CheckoutView.as_view(), name='checkout'),
        url(r'^checkout/(?P<step>.+)/$', CheckoutView.as_view(), name='checkout'),
        url(r'^pay/', include(payment_backends_urls))
    )
