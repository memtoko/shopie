from decimal import Decimal

from django.conf.urls import patterns, url
from django.template import RequestContext
from django.utils.translation import ugettext_lazy as _
from django.shortcuts import render_to_response
from django.utils.decorators import method_decorator

from .base import PaymentBackendBase
from shopie.models import Order, Payment

class PaymentBacs(PaymentBackendBase):
    url_namespace = 'bacs_payment'
    backend_name = _('Bank Transfer')
    template = 'shopie/payment/backend/bacs.html'

    def process_order_payment(self, order, request):
        """Because this payment basically require store staff to check the customer
        already paid the order via bank transfer. If it paid or not, the store staff
        can accept or reject the order accordingly.
        """
        reference = self.backend_name + '-' + order.pk

        payment = Payment.objects.create(
            order=order,
            amount=order.order_total,
            method=self.backend_name,
            reference=reference,
            refundable=False,
            confirmed=False
        )

    def on_order_acceptance(self, sender, order, **kwargs):
        payments = Payment.objects.filter(
            order=order,
            method=self.backend_name,
            confirmed=False
        )

        for payment in payments.all():
            payment.confirmed = True
            payment.save()
