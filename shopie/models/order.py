"""Our concept for an order is, a collection of products along with other
information about how they should be delivered and billed to a customer.

Then basket or cart, is simply an order which has not yet been "checked out".
because of that a cart is simply an order in backends.
"""

import hashlib
import random
from decimal import Decimal

from django.db.models.signals import post_save
from django.db import models
from django.contrib.auth.models import AnonymousUser
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.core.urlresolvers import reverse as _urlreverse
from django.conf import settings

from .product import Product
from .fields import CurrencyField
from .base import BaseModel, TimeStampsMixin
from shopie.signals import (
    order_status_changed, order_confirmation, order_acceptance, order_rejection)
from shopie.utils.users import user_model_string
from shopie.utils.text import create_sha1_key

class OrderState(BaseModel):
    """An abstract order model to manage order state. Our order have 5 state on
    their lifecycle. All of them represented with integer value.

    STATE_BUILDING - this state represent the order still on the cart state, on
    other words, the customer still adding item to this order or edit the quantity.
    STATE_CONFIRMING - This state mean the customer has completed their first round
    of entering details. Now the customer only need to confirm it.
    STATE_RECEIVED - This state mean the customer has confirmed, and the order marked
    to received. The store staff need to accept or rejected this order.
    STATE_ACCEPTED - The store staff accepted this order.
    STATE_REJECTED - The store staff rejected this order.
    """
    STATE_BUILDING = 10 # this state indicate the order in "cart" state
    STATE_CONFIRMING = 20
    STATE_RECEIVED = 30
    STATE_ACCEPTED = 40
    STATE_REJECTED = 50

    ORDER_STATES = (
        (STATE_BUILDING, _('Building')),
        (STATE_CONFIRMING, _('Confirming')),
        (STATE_RECEIVED, _('Received')),
        (STATE_ACCEPTED, _('Accepted')),
        (STATE_REJECTED, _('Rejected'))
    )

    status = models.IntegerField(choices=ORDER_STATES, default=STATE_BUILDING,
        verbose_name=_('Status'))

    @property
    def is_building(self):
        return self.status == self.STATE_BUILDING

    @property
    def is_confirming(self):
        return self.status == self.STATE_CONFIRMING

    def get_status_name(self):
        return dict(self.ORDER_STATES)[self.status]

    def update_status(self, new_status, save=False):
        """If you want to update order status, then do it through this method,
        so we can notify callback which listen to order_status_changed signals
        """
        if not self.pk:
            return

        old_status = self.status
        new_status = int(new_status)

        # verify the new status is valid
        if new_status not in dict(self.ORDER_STATES):
            raise ValueError("Invalid order status.")

        if old_status != new_status:
            self.status = new_status
            if save:
                self.save()
            # send signals
            order_status_changed.send(sender=self.__class__,
                change_from=old_status, change_to=new_status, order=self)

    class Meta:
        abstract = True

class OrderQuerySet(models.QuerySet):

    def where_status(self, status):
        if isinstance(status, int):
            return self.filter(status=status)
        else:
            return self.filter(status__in=status)

    def where_author(self, author):
        return self.filter(author=author)

class Order(OrderState, TimeStampsMixin):
    """The actul order we use"""
    full_name = models.CharField(max_length=255, blank=True,
        verbose_name=_('Full name'))
    email = models.EmailField(_('Email address'))
    # this is the customer that place the order (customer)
    user = models.ForeignKey(user_model_string(), blank=True, null=True,
        verbose_name=_('customer'))
    received_at = models.DateTimeField(blank=True, null=True,
        verbose_name=_('received_at'))
    order_key = models.CharField(max_length=255, unique=True, blank=True,
        verbose_name=_('Order Key'))
    order_subtotal = CurrencyField(default=Decimal('0.0'),
        verbose_name=_('Order Subtotal'))
    order_total = CurrencyField(default=Decimal('0.0'),
        verbose_name=_('Order Total'))
    objects = OrderQuerySet.as_manager()

    #
    accepted_at = models.DateTimeField(blank=True, null=True,
        verbose_name=_("accepted date"))
    accepted_by = models.ForeignKey(user_model_string(), blank=True, null=True,
        verbose_name=_("accepted by"))
    rejected_at = models.DateTimeField(blank=True, null=True,
        verbose_name=_("rejected data"))
    rejected_by = models.ForeignKey(user_model_string(), blank=True, null=True,
        verbose_name=_("rejected by"))

    def add_item(self, product, quantity=1, merge=True, queryset=None):
        if not product.orderable:
            raise ValueError(
                _('Trying to add product to order item which not orderable')
            )

        if queryset is None:
            queryset = OrderItem.objects.filter(order=self, product=product)

        if queryset.exists() and merge:
            order_item = queryset[0]
            order_item.quantity += quantity
            order_item.save()
        else:
            order_item = OrderItem.objects.create(
                order=self,
                quantity=quantity,
                product=product
            )
            order_item.save()

        # save current state
        self.save()

        return order_item

    def update_quantity(self, quantity, order_item_id=None, order_item=None):
        if order_item is None and order_item_id is not None:
            order_item = OrderItem.objects.get(pk=order_item_id)

        if order_item is None:
            raise ValueError(
                _('You should provide either order_item_id or order_item')
            )

        if quantity == 0:
            order_item.delete()
        else:
            # force to int
            order_item.quantity = int(quantity)
            order_item.save()

        self.save()

    def proceed_to_confirm(self):
        """This method should be executed when the user has completed their
        first round of entering details. This will mark the order as "confirming".
        Now the customer only need to confirm.
        """
        self.update_status(self.STATE_CONFIRMING, save=True)

    def confirm(self):
        """This method should be executed when the order should be completed
        by the customer.
        """
        # first notify all listener this order is about to confirm
        order_confirmation.send(sender=self.__class__, order=self)
        self.received_at = timezone.now()
        for item in self.items.all():
            item.confirm()

        self.update_status(self.STATE_RECEIVED, save=True)

    def accept(self, user=None):
        order_acceptance.send(sender=self.__class__, order=self)

        self.accepted_at = timezone.now()
        if user is not None:
            self.accepted_by = user

        for item in self.items.all():
            item.accept()

        self.update_status(self.STATE_ACCEPTED, save=True)

    def reject(self, user=None):
        order_rejection.send(sender=self.__class__, order=self)

        self.rejected_at = timezone.now()
        if user is not None:
            self.rejected_by = user

        for item in self.items.all():
            item.reject()

        self.update_status(self.STATE_REJECTED, save=True)

    @property
    def total_items(self):
        return sum([ci.quantity for ci in self.items.all()])

    @property
    def is_empty(self):
        return self.items.all().exists()

    @property
    def has_item(self):
        return self.total_items > 0

    @property
    def build_time(self):
        """Return timedelta"""
        return None if self.received_at is None else self.received_at - self.created_at

    def __str__(self):
        return _('Order ID: %(id)s') % {'id': self.pk}

    def save(self, *args, **kwargs):
        self.calculate()
        if not self.order_key:
            self.order_key = create_sha1_key(str(random.random()))
        super(Order, self).save(*args, **kwargs)

    def calculate(self):
        """calculate order line subtotal and total. Call this if there any change
        to related order, such as item quantity, remove
        """
        current_subtotal = Decimal('0.00') # holder

        for item in self.items.all():
            item.calculate()
            current_subtotal += item.line_total

        current_total = self.order_subtotal = current_subtotal

        for extra_price in self.extra_price_fields.all():
            current_total += extra_price.value

        self.order_total = current_total

    class Meta:
        verbose_name = _('Order')
        verbose_name_plural = _('Orders')

class OrderItem(BaseModel):

    order = models.ForeignKey(Order, related_name='items',
        verbose_name=_('Order Item'))
    product = models.ForeignKey(Product, verbose_name=_('Product'))
    unit_price = CurrencyField(default=Decimal('0.0'),
        verbose_name=_('Unit Price'))
    quantity = models.IntegerField(verbose_name=_('Quantity'), default=1)
    line_subtotal = CurrencyField(default=Decimal('0.0'),
        verbose_name=_('Line Subtotal'))
    line_total = CurrencyField(default=Decimal('0.0'),
        verbose_name=_('Line Total'))

    def __str__(self):
        return 'order item: %(id)s' % {'id': self.product.name}

    def save(self, *args, **kwargs):
        self.calculate()
        super(OrderItem, self).save(*args, **kwargs)

    def calculate(self):
        self.line_subtotal = self.product.get_price() * self.quantity
        current_total = self.line_subtotal

        for extra_price in self.extra_price_fields.all():
            current_total += extra_price.value

        self.line_total = current_total

    def confirm(self):
        """hook when order is about to confirm"""
        self.save()

    def accept(self):
        """Hook when order is accepted by store staff, default is pass"""
        self.save()

    def reject(self):
        """Hook when order is rejected by store staff"""
        self.save()

class ExtraPriceOrderField(BaseModel):
    order = models.ForeignKey(Order, related_name="extra_price_fields",
        verbose_name=_('Order'))
    label = models.CharField(max_length=255, verbose_name=_('Label'))
    value = CurrencyField(verbose_name=_('Amount'))

class ExraPriceOrderItemField(BaseModel):
    order_item = models.ForeignKey(OrderItem, related_name="extra_price_fields",
        verbose_name=_('Order item'))
    label = models.CharField(max_length=255, verbose_name=_('Label'))
    value = CurrencyField(verbose_name=_('Amount'))
