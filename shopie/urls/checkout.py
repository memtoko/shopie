from django.conf.urls import patterns, url, include

from shopengine.views.checkout import CheckoutView, checkout_thank_you
from shopengine.views.checkout import CheckoutView
from shopengine.payment.backends.urls import urlpatterns as payment_backends_urls

urlpatterns = patterns('',
        url(r'^checkout/$', CheckoutView.as_view(), name='checkout'),
        url(r'^checkout/(?P<step>.+)/$', CheckoutView.as_view(), name='checkout'),
        url(r'^thank-you/(?P<order_key>.+)/$', checkout_thank_you, name='checkout_thankyou'),
        url(r'^pay/', include(payment_backends_urls))
    )