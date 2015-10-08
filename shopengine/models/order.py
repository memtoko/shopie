import hashlib
import random
from decimal import Decimal

from django.db import models
from django.contrib.auth.models import AnonymousUser
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse
from django.conf import settings

from .product import Product
from .fields import CurrencyField
from .base import BaseModel
from shopengine.signals import order_added, order_status_changed
from shopengine.utils.users import user_model_string

class OrderQuerySet(models.QuerySet):

    def completed(self):
        return self.filter(status=60)

    def for_user(self, user):
        return self.filter(user=user)

    def get_latest_for_user(self, user):
        """Return the last order for the user placed"""
        if user and not isinstance(user, AnonymousUser):
            return self.filter(user=user).order_by('-modified')[0]
        return None

    def unconfirmed_cart(self, cart):
        return self.filter(cart_pk=cart.pk, status__lt=40)

    def remove_old_orders(self, cart):
        old_orders = self.unconfirmed_cart(cart)
        old_orders.delete()

    def create_order_object(self, cart, request, order_status=10):
        order = self.model()
        order.cart_pk = cart.pk
        order.user = cart.user
        order.status = order_status
        order.order_subtotal = cart.subtotal_price
        order.order_total = cart.total_price
        order.order_key = self._make_order_key(cart.pk)
        return order

    def create_from_cart(self, cart, request):
        # import cart item model here
        from .cart import CartItem
        # lets remove old order
        self.remove_old_orders(cart)
        order = self.create_order_object(cart, request)
        order.save()

        for field in cart.extra_price_fields:
            eo = ExtraPriceOrderField()
            eo.order = order
            eo.value = field[1]
            eo.label = str(field[0])
            eo.save()

        cart_items = CartItem.objects.filter(cart=cart)
        for item in cart_items:
            item.update(request)
            order_item = OrderItem()
            order_item.order = order
            order_item.product = item.product
            order_item.unit_price = item.product.unit_price
            order_item.quantity = item.quantity
            order_item.line_subtotal = item.line_subtotal
            order_item.line_total = item.line_total
            order_item.save()
            #then try to save the extra price
            for it in item.extra_price_fields:
                eoi = ExraPriceOrderItemField()
                eoi.order_item = order_item
                eoi.label = str(it[0])
                eoi.value = it[1]
                eoi.save()
        # send the signals
        order_added.send(sender=self, user=request.user, order=order)
        return order

    def _make_order_key(self, based):
        salt = hashlib.sha1(str(random.random()).encode('ascii')).hexdigest()[:5]
        salt = salt.encode('ascii')
        base = str(based)
        if isinstance(base, str):
            base = base.encode('utf-8')
        return hashlib.sha1(salt+base).hexdigest()

    def add_order_to_request(self, request, order):
        if request.user and not isinstance(request.user, AnonymousUser):
            if order.user != request.user:
                order.user = request.user
                order.save()
        else:
            if not order.order_key:
                order.order_key = self._make_order_key(order.cart_pk)
                order.save()
            request.session['_order_key'] = order.order_key

    def get_orders_from_request(self, request):
        orders = None
        if request.user and not isinstance(request.user, AnonymousUser):
            orders = Order.objects.for_user(request.user).order_by('-order_date')
        else:
            session = getattr(request, 'session', None)
            if session is not None:
                order_key = session.get('_order_key', None)
                if order_key is not None:
                    orders = Order.objects.filter(order_key=order_key)
        return orders

    def get_order_from_request(self, request):
        orders = self.get_orders_from_request(request)
        if orders.exists():
            order = orders[0]
        else:
            order = None
        return order


class Order(BaseModel):
    """An Order base class to manage order from customer"""

    # Marker of order state value
    PENDING = 10
    ON_HOLD = 20
    PROCESSING = 30
    CONFIRMING = 40
    CONFIRMED = 50
    COMPLETED = 60
    CANCELED = 70
    REFUNDED = 80

    # Tuple of Order State, and their name just for human reading
    ORDER_STATES = (
        (PENDING, _('Pending')),
        (ON_HOLD, _('On Hold')),
        (PROCESSING, _('Processing')),
        (CONFIRMING, _('Confirming')),
        (CONFIRMED, _('Confirmed')),
        (COMPLETED, _('Completed')),
        (CANCELED, _('Cancelled')),
        (REFUNDED, _('Refunded')),
    )

    objects = OrderQuerySet.as_manager()
    # This maybe empty if created with session though
    full_name = models.CharField(max_length=255, blank=True, null=True,
        verbose_name=_('full name'))
    email = models.EmailField(_('email address'), blank=True)
    user = models.ForeignKey(user_model_string(), blank=True, null=True,
        verbose_name=_('Customer'))
    status = models.IntegerField(choices=ORDER_STATES, default=ON_HOLD,
        verbose_name=_('Status'))
    order_date = models.DateTimeField(verbose_name=_('Order Date'), auto_now=True)
    order_key = models.CharField(max_length=255, unique=True, blank=True,
        null=True, verbose_name=_('Order Key'))
    order_subtotal = models.DecimalField(max_digits=30, decimal_places=2,
        default=Decimal('0.0'), verbose_name=_('Order Subtotal'))
    order_total = models.DecimalField(max_digits=30, decimal_places=2,
        default=Decimal('0.0'), verbose_name=_('Order Total'))
    cart_pk = models.PositiveIntegerField(_('Cart primary key'),
        blank=True, null=True)

    def __str__(self):
        return _('Order ID: %(id)s') % {'id': self.pk}

    def get_status_name(self):
        return dict(self.ORDER_STATES)[self.status]

    def update_status(self, new_status):
        if not self.pk:
            return
        old_status = self.status
        new_status = int(new_status)

        if old_status != new_status:
            self.status = new_status
            self.save()
            #send signals
            order_status_changed.send(sender=self,
                change_from=old_status, change_to=new_status, order=self)


class OrderItem(BaseModel):

    order = models.ForeignKey(Order, related_name='items',
        verbose_name=_('Order Item'))
    product = models.ForeignKey(Product, verbose_name=_('Product'))
    unit_price = models.DecimalField(max_digits=30, decimal_places=2,
        default=Decimal('0.0'), verbose_name=_('Unit Price'))
    quantity = models.IntegerField(verbose_name=_('Quantity'), default=1)
    line_subtotal = models.DecimalField(max_digits=30, decimal_places=2,
        default=Decimal('0.0'), verbose_name=_('Line Subtotal'))
    line_total = models.DecimalField(max_digits=30, decimal_places=2,
        default=Decimal('0.0'), verbose_name=_('Line Total'))

    def __str__(self):
        return 'order item: %(id)s' % {'id': self.product.name}

class ExtraPriceOrderField(BaseModel):
    order = models.ForeignKey(Order, verbose_name=_('Order'))
    label = models.CharField(max_length=255, verbose_name=_('Label'))
    value = CurrencyField(verbose_name=_('Amount'))

class ExraPriceOrderItemField(BaseModel):
    order_item = models.ForeignKey(OrderItem, verbose_name=_('Order item'))
    label = models.CharField(max_length=255, verbose_name=_('Label'))
    value = CurrencyField(verbose_name=_('Amount'))

class OrderPayment(models.Model):
    order = models.ForeignKey(Order, verbose_name=_('order'))
    amount = CurrencyField(verbose_name=_('amount'))
    transaction_id = models.CharField(max_length=255,
            verbose_name=_('Transaction ID'),
            help_text=_("The transaction processor's reference"))
    payment_method = models.CharField(max_length=255,
            verbose_name=_('Payment method'),
            help_text=_("The payment backend used to process the purchase"))
    created_at = models.DateTimeField(auto_now_add=True,
        verbose_name=_('Date added'), blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True,
        verbose_name=_('Last modified'), blank=True, null=True)

    def __str__(self):
        return 'Payment: %(id)s for order %(order_id)s' % {'id': self.transaction_id, 'order_id': self.order.pk}

