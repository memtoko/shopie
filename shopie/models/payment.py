"""Previously this on order file

"""
from django.db import models
from django.contrib.auth.models import AnonymousUser
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse
from django.conf import settings

from decimal import Decimal

from .base import TimeStampsMixin
from .order import Order
from .fields import CurrencyField

class RefundFailed(Exception): pass

class PaymentManager(models.Manager):

    def refund(self, amount, payment=None, payment_id=None):
        if payment is None and payment_id is not None:
            payment = self.filter(pk=payment)[0]
        if payment is None:
            raise ValueError(_("Make sure you pass payment or payment_id"))

        amount = Decimal(amount)
        if payment.refundable_amount >= amount:
            _amount = Decimal('0.00') - amount
            self.create(
                    order=payment.order, parent=payment, amount=_amount,
                    method=payment.method, reference=payment.reference,
                )
            payment.amount_refunded += amount
            payment.save()
        else:
            raise RefundFailed(_(
                "Refund action failed, %s is greater than refundable amount." \
                "Max amount allowed is %s" % (amount, payment.refundable_amount)
            ))

class Payment(TimeStampsMixin):
    order = models.ForeignKey(Order, verbose_name=_("Order"))
    amount = CurrencyField(verbose_name=_("amount"))
    method = models.CharField(max_length=255, verbose_name=_("payment method"))
    transaction_id = models.CharField(max_length=255,
        verbose_name=_('transaction ID'))
    reference = models.CharField(max_length=255, verbose_name=_("payment reference"))
    confirmed = models.BooleanField(verbose_name=_('confirmed'), default=True)
    refundable = models.BooleanField(verbose_name=_('refundable'), default=False)
    amount_refunded = CurrencyField(verbose_name=_("amount refunded"), default=Decimal('0.00'))
    parent = models.ForeignKey('self', verbose_name=_("payment parent"),
        blank=True, null=True)
    objects = PaymentManager()

    def __str__(self):
        identification = self.transaction_id or self.pk
        return "Paymen: #%s" % (identification)

    @property
    def is_refund(self):
        return self.amount < Decimal('0.00')

    @property
    def refunded(self):
        return self.amount_refunded > Decimal('0.00')

    @property
    def refundable_amount(self):
        return self.amount - self.amount_refunded if self.refundable else Decimal('0.00')
