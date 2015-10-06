from decimal import Decimal

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse

from .base import BaseModel
from .product import Product
from shopengine.utils.users import user_model_string
from shopengine.cart import cart_modifier_pool, ContextModifier

class Cart(BaseModel):

    user = models.OneToOneField(user_model_string(), null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __init__(self, *args, **kwargs):
        super(Cart, self).__init__(*args, **kwargs)
        self.subtotal_price = Decimal('0.0')
        self.total_price = Decimal('0.0')
        self.current_total = Decimal('0.0')
        self.extra_price_fields = []
        self._updated_cart_items = None

    def add_product(self, product, quantity=1, merge=True, queryset=None):
        """Add product to Cart"""
        if not product.orderable:
            raise ValueError("Product has to be orderable")
        # save current state
        self.save()

        if queryset is None:
            queryset = CartItem.objects.filter(cart=self, product=product)
        item = queryset

        if item.exists() and merge:
            cart_item = item[0]
            cart_item.quantity += int(quantity)
            cart_item.save()
        else:
            cart_item = CartItem.objects.create(
                    cart=self, product=product, quantity=int(quantity)
                )
            cart_item.save()
        return cart_item

    def update_quantity(self, cart_item_id, quantity):
        cart_item = self.items.get(pk=cart_item_id)
        if quantity == 0:
            cart_item.delete()
        else:
            cart_item.quantity = int(quantity)
            cart_item.save()
        self.save()
        return cart_item

    def delete_item(self, cart_item_id):
        cart_item = self.items.get(pk=cart_item_id)
        cart_item.delete()
        self.save()

    def update(self, request):
        items = CartItem.objects.filter(cart=self).order_by('pk')
        product_ids = [item.product.pk for item in items]
        products = Product.objects.filter(pk__in=product_ids)
        prod_dict = dict([(p.pk, p) for p in products])

        if not hasattr(request, 'cart_modifier_state'):
            setattr(request, 'cart_modifier_state', {})

        modifiers = cart_modifier_pool.get_backend_list()
        with ContextModifier(modifiers, self, request):
            for item in items:
                item.product = prod_dict[item.product_id]
                self.subtotal_price += item.update(request)

            self.current_total = self.subtotal_price

            for modifier in modifiers:
                modifier.process_cart(self, request)

            self.total_price = self.current_total

        self._updated_cart_items = items

    def get_updated_cart_items(self):
        assert self._updated_cart_items is not None, ('Cart need to be '
            'updated before calling get_updated_cart_items')
        return self._updated_cart_items

    def empty_cart(self, request=None):
        if self.pk:
            self.items.all().delete()
            self.delete()

    @property
    def total_quantity(self):
        return sum([ci.quantity for ci in self.items.all()])

    @property
    def is_empty(self):
        return self.total_quantity == 0

class CartItem(BaseModel):

    cart = models.ForeignKey(Cart, related_name="items")
    quantity = models.IntegerField()
    product = models.ForeignKey(Product)

    def __init__(self, *args, **kwargs):
        super(CartItem, self).__init__(*args, **kwargs)
        self.extra_price_fields = []  # list of tuples (label, value)
        # These must not be stored, since their components can be changed
        # between sessions / logins etc...
        self.line_subtotal = Decimal('0.0')
        self.line_total = Decimal('0.0')
        self.current_total = Decimal('0.0')  # Used by cart modifiers

    def update(self, request):
        self.extra_price_fields = []  # Reset the price fields
        self.line_subtotal = self.product.get_price() * self.quantity
        self.current_total = self.line_subtotal

        for modifier in cart_modifier_pool.get_backend_list():
            # We now loop over every registered price modifier,
            # most of them will simply add a field to extra_payment_fields
            modifier.process_cart_item(self, request)

        self.line_total = self.current_total
        return self.line_total

class Disscount(BaseModel):
    DISSCOUNT_TYPE_FLAT = 10
    DISSCOUNT_TYPE_PERCENTAGE = 20

    DISSCOUNT_TYPES = (
        (DISSCOUNT_TYPE_FLAT, 'Flat Amount'),
        (DISSCOUNT_TYPE_PERCENTAGE, 'Percentage')
    )
    """We decided to build this one in cart app, because it relation so tight."""
    name = models.CharField(max_length=255, verbose_name=_('name'))
    # the code of discount, customer should know this if they wanted to use
    code = models.CharField(max_length=255, verbose_name=_('code'))
    discount_type = models.IntegerField(choices=DISSCOUNT_TYPES,
        default=DISSCOUNT_TYPE_PERCENTAGE, verbose_name=_('discount type'))
    amount = models.DecimalField(max_digits=30, decimal_places=2,
        default=Decimal('0.0'), verbose_name=_('amount'))
    min_amount_cart = models.DecimalField(max_digits=30, decimal_places=2,
        default=Decimal('0.0'), verbose_name=_('min amount cart'))
    start_date = models.DateTimeField(verbose_name=_('start date'))
    end_date = models.DateTimeField(verbose_name=_('end date'))
    max_used = models.IntegerField(verbose_name=_('maximum used'))
    used = models.IntegerField(verbose_name=_('used'), default=0)



