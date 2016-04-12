from urllib.parse import urlencode
from decimal import Decimal

from django.conf import settings
from django.http import HttpResponseRedirect, HttpResponseBadRequest
from django.conf.urls import patterns, url
from django.utils.decorators import method_decorator
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _

from paypalrestsdk import Api as PaypalAPI, Payment as PaypalPaymentSDK
import requests as requestlib

from .base import PaymentBackendBase, PaymentProcessingError
from shopie.models import (Order, Payment, PaymentProperty, ExtraPriceOrderField,
    ExraPriceOrderItemField)
from shopie.utils.formatting import moneyfmt


if getattr(settings, 'PAYPAL_PAYMENT_SANDBOX', True):
    paypalmode = 'sandbox'
else:
    paypalmode = 'live'

shopiepaypal = PaypalAPI({
        'mode': paypalmode,
        'client_id': getattr(settings, 'PAYPAL_API_CLIENT_ID', None),
        'client_secret': getattr(settings, 'PAYPAL_API_SECRET', None)
    })

rate_exchange = getattr(settings, 'PAYPAL_RATE_EXCHANGE', 13800)

class PaypalPayment(PaymentBackendBase):
    url_namespace = 'paypal_payment'
    backend_name = _('Paypal')

    def get_urls(self):
        urlpatterns = patterns('',
            url(r'^/(?P<order_key>[^\.]+)/$', self.accept_paypal_payment, name='paypal_payment')
        )
        return urlpatterns

    def accept_paypal_payment(self, request, order_key=None):
        try:
            payer_id = request.GET['PayerID']
            payment_id = request.GET['paymentId']
            token = request.GET.get('token', None)
            order_key = order_key
        except KeyError:
            return HttpResponseBadRequest('Bad request.')
        else:
            paypal_payment = PaypalPaymentSDK.find(payment_id, api=shopiepaypal)

            if paypal_payment.execute({'payer_id': payer_id}):
                # this will success
                order = Order.objects.get(order_key=order_key)
                self._create_payment(
                    order=order, token=token, payment_id=payment_id,
                    payer_id=payer_id
                )
                # because we want to give acccess to download "thing" as soon
                # as customer pay the bill, and we just do that here. We will
                # go ahead and accept this order.
                order.accept()

                return HttpResponseRedirect(self.get_thank_you_page(request))
            else:
                raise PaymentProcessingError(
                    "There was an error contacting the payment processor"
                )

    def get_redirect(self, order, request):
        absolute_uri = request.build_absolute_uri
        items = self._get_order_items(order)
        amount_total = sum([Decimal(it['price']) for it in items])

        payment_arguments = {
            'intent': 'sale',
            'payer': {
                'payment_method': 'paypal'
            },
            'redirect_urls': {
                'return_url': absolute_uri(reverse('shopie:paypal_payment',
                    kwargs={
                        'order_key': order.order_key
                    })),
                'cancel_url': absolute_uri(reverse('shopie:checkout'))
            },
            'transactions': [{
                'item_list': {
                    'items': items
                },
                'amount': {
                    'total': moneyfmt(amount_total),
                    'currency': 'USD'
                },
                'description': 'Make sure to include'
            }]
        }
        payment = PaypalPaymentSDK(payment_arguments, api=shopiepaypal)
        if payment.create():
            for link in payment.links:
                if link.method == 'REDIRECT':
                    return str(link.href)
        else:
            raise PaymentProcessingError(
                "There was an error contacting the payment processor"
            )

    def _create_payment(self, order=None, token=None, payment_id=None, payer_id=None):

        payment = Payment.objects.create(
            order=order,
            amount=order.order_total,
            method=self.backend_name,
            reference=payment_id,
            refundable=True,
            confirmed=True
        )

        # save the property
        PaymentProperty.objects.create(
            payment=payment,
            key="paypal_payment_id",
            value=payment_id
        )

        PaymentProperty.objects.create(
            payment=payment,
            key="paypal_payer_id",
            value=payer_id
        )

        if token is not None:
            PaymentProperty.objects.create(
                payment=payment,
                key="paypal_payment_token",
                value=token
            )

    def _get_order_items(self, order):
        output = []
        item_ids = []
        for item in order.items.all():
            item_ids.append(item.pk)
            formatted_price = moneyfmt(item.unit_price / Decimal(rate_exchange))
            transaction = {
                'name': item.product.fullname,
                'sku': 'prod-' + item.product.fullname,
                'price': formatted_price,
                'currency': 'USD',
                'quantity': item.quantity
            }
            output.append(transaction)
        # then try to add extra price there
        for eo in ExtraPriceOrderField.objects.filter(order=order):
            formatted_price = moneyfmt(eo.value / Decimal(rate_exchange))
            transaction = {
                'name': eo.label,
                'sku': 'extra-' + eo.label,
                'price': formatted_price,
                'quantity': '1'
            }
            output.append(transaction)
        for eio in ExraPriceOrderItemField.objects.filter(order_item__pk__in=item_ids):
            formatted_price = moneyfmt(eio.value / Decimal(rate_exchange))
            transaction = {
                'name': eio.label,
                'sku': 'extra-item-' + eo.label,
                'price': formatted_price,
                'quantity': '1'
            }
            output.append(transaction)
        return output
