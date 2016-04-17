from django.conf.urls import include, url

routes = [
    'shopie.urls.product',
    'shopie.urls.issue',
    'shopie.urls.api',
    'shopie.urls.admin',
    'shopie.urls.account',
    'shopie.urls.cart',
    'shopie.urls.checkout',
    'shopie.payment.backends.urls'
]

urlpatterns = [url(r'', include(route)) for route in routes]
