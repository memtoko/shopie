from decimal import Decimal

from django.conf.urls import patterns, url
from django.template import RequestContext
from django.utils.translation import ugettext_lazy as _
from django.shortcuts import render_to_response
from django.utils.decorators import method_decorator

from .base import PaymentBackendBase
from shopengine.models import Order
from shopengine.decorators import order_session_required

class PaymentBacs(PaymentBackendBase):
    url_namespace = 'bacs_payment'
    backend_name = _('Bank Transfer')
    template = 'shopengine/payment/backend/bacs.html'

    def get_urls(self):
        urlpatterns = patterns('',
                url(r'^$', self.payment_view, name='bacs_payment')
            )
        return urlpatterns

    @method_decorator(order_session_required)
    def payment_view(self, request):
        order = Order.objects.get_order_from_request(request)
        amount = order.order_total
        transaction_id = self._create_transaction_id(order)

        # This payment backend doesn't do any charge, it just let
        # the shop staff to manually check customer already paid
        # to their bank account, so we just need to create 0 payment order amount
        self.create_order_payment(order, transaction_id=transaction_id,
            amount=Decimal('0.0'))
        # empty the cart
        self.empty_cart(order, request)

        # prepate the context
        ctx = {
            'order': order,
            'amount': amount,
            'transaction_id': transaction_id
        }
        context = RequestContext(request, ctx)
        return render_to_response(self.template, context)
