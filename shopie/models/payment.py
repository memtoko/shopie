"""Payment model manage Order's payment. This model contains information
the amount of customer pay for the order, payment method, and amount of refunded.
"""
from django.db import models
from django.contrib.auth.models import AnonymousUser
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse
from django.conf import settings

from decimal import Decimal

from shopie.signals.payment import payment_refund

from .base import BaseModel, TimeStampsMixin
from .order import Order
from .fields import CurrencyField

class RefundFailed(Exception): pass

class PaymentQuerySet(models.QuerySet):

    def refundable(self):
        return self.filter(refundable=True)

    def confirmed(self):
        return self.filter(confirmed=True)

    def for_order(self, order):
        """Filter payment for the given order"""
        return self.fiter(order=order)

    def payment_method(self, method):
        return self.filter(method=method)

    def payment_method_count(self, method):
        return self.payment_method(method).count()

class PaymentManager(models.Manager):

    def get_queryset(self):
        return PaymentQuerySet(self.model, using=self._db)

    def refundable(self):
        return self.get_queryset().refundable()

    def confirmed(self):
        return self.get_queryset().confirmed()

    def for_order(self, order):
        return self.get_queryset().for_order(order=order)

    def payment_method(self, method):
        return self.get_queryset().payment_method()

    def refund(self, amount, payment=None, payment_id=None):
        """Attempt to refund for the given payment, will only success if payment
        refundable greater than the amount given.
        """
        if payment is None and payment_id is not None:
            payment = self.filter(pk=payment)[0]
        if payment is None:
            raise ValueError(_("Make sure you pass payment or payment_id"))

        payment_refund.send(sender=self.__class__, payment=payment)
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

class Payment(TimeStampsMixin, BaseModel):
    order = models.ForeignKey(Order, verbose_name=_("Order"), related_name="payments")
    amount = CurrencyField(verbose_name=_("amount"))
    method = models.CharField(max_length=255, verbose_name=_("payment method"))
    reference = models.CharField(max_length=255, verbose_name=_("payment reference"))
    confirmed = models.BooleanField(verbose_name=_('confirmed'), default=True)
    refundable = models.BooleanField(verbose_name=_('refundable'), default=False)
    amount_refunded = CurrencyField(verbose_name=_("amount refunded"), default=Decimal('0.00'))
    parent = models.ForeignKey('self', verbose_name=_("payment parent"),
        blank=True, null=True)
    objects = PaymentManager()

    def __str__(self):
        identification = self.transaction_id or self.pk
        return "Payment: #%s" % (identification,)

    @property
    def is_refund(self):
        return self.amount < Decimal('0.00')

    @property
    def refunded(self):
        return self.amount_refunded > Decimal('0.00')

    @property
    def refundable_amount(self):
        return self.amount - self.amount_refunded if self.refundable else Decimal('0.00')

class PaymentProperty(models.Model):
    """Payment property usefull when you need to store custom"""
    payment = models.ForeignKey(Payment, related_name="payment_properties")
    key = models.CharField(max_length=255, verbose_name=_('propery key'))
    value = models.CharField(max_length=255, verbose_name=_('propery value'))
