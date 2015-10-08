from django.conf.urls import patterns, url, include

<<<<<<< HEAD
from shopengine.views.checkout import CheckoutView, checkout_thank_you
=======
from shopengine.views.checkout import CheckoutView
>>>>>>> a2ba9374898ef2aa88e1a8abcf883f891977dc25
from shopengine.payment.backends.urls import urlpatterns as payment_backends_urls

urlpatterns = patterns('',
        url(r'^checkout/$', CheckoutView.as_view(), name='checkout'),
        url(r'^checkout/(?P<step>.+)/$', CheckoutView.as_view(), name='checkout'),
        url(r'^thank-you/(?P<order_key>.+)/$', checkout_thank_you, name='checkout_thankyou'),
        url(r'^pay/', include(payment_backends_urls))
    )
