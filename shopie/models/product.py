"""Product and related product models.

for simple implementation of product variant, i am consider to treat all product
have variation. If it only have one variant, then it will be simple product.
"""
import os
from datetime import datetime, timezone
from decimal import Decimal
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse

from .base import BaseModel, SluggableMixin, TimeStampsMixin
from .fields import CurrencyField
from shopengine.utils.text import slugify
from shopengine.utils.users import user_model_string

class ProductQuerySet(models.QuerySet):

    def active(self):
        return self.filter(is_active=True)

    def published(self):
        return self.filter(status=AbstractProduct.STATUS_PUBLISHED)

    def where_author(self, author):
        return self.filter(author=author)

class AbstractProduct(BaseModel, SluggableMixin, TimeStampsMixin):
    """An abstract product that can be used to create specifix product spec.
    """
    STATUS_DRAFT = 10
    STATUS_PENDING_REVIEW = 20
    STATUS_PUBLISHED = 30

    PRODUCT_STATUSES = (
        (STATUS_DRAFT, _('Draft')),
        (STATUS_PENDING_REVIEW, _('Pending Review')),
        (STATUS_PUBLISHED, _('Published'))
    )

    name = models.CharField(max_length=255, verbose_name=_('Product Name'))
    short_description = models.TextField(max_length=255, verbose_name=_('Short Description'))
    description = models.TextField(verbose_name=_('Descriptions'))
    author = models.ForeignKey(user_model_string(), blank=True, null=True,
        verbose_name=_('Author'))
    unit_price = CurrencyField(verbose_name=_('Unit Price'), default=Decimal(0))
    # Control available
    is_active = models.BooleanField(default=False, verbose_name=_('Active'))
    status = models.IntegerField(choices=PRODUCT_STATUSES, default=STATUS_DRAFT,
        verbose_name=_('Status'))
    # simple implementation of product variant
    parent = models.ForeignKey('self', verbose_name=_('Product Parent'),
        blank=True, null=True)
    objects = ProductQuerySet.as_manager()

    def get_variants(self):
        return self.objects.filter(parent=self)

    @property
    def price(self):
        return self.price if self.is_variant else min([v.unit_price for v in self.get_variants()])

    @property
    def has_variant(self):
        return self.get_variants().exists()

    @property
    def is_variant(self):
        return not sel.has_variant

    @property
    def is_parent(self):
        """Alias for has variant"""
        return self.has_variant

    @property
    def orderable(self):
        return self.is_active and self.status == self.STATUS_PUBLISHED

    class Meta:
        abstract: True

    def save(self, **kwargs):
        super(AbstractProduct, self).save(**kwargs)
        # then check it if it variant
        if self.parent:
            # this product has parent so it should variant, in that case change
            # the unit price of parent to 0
            self.parent.unit_price = Decimal('0.00')
            self.parent.save()

    @property
    def fullname(self):
        return "%s (%s)" % (self.product.name, self.name) if self.parent else self.name

class Product(AbstractProduct):
    # License related info
    activation_limit = models.IntegerField(blank=True, null=True)
    license_expiry = models.IntegerField(blank=True, null=True)
    image = models.FileField(upload_to="images", verbose_name='Product image')

    class Meta(object):
        verbose_name = _('Product')
        verbose_name_plural = _('Products')

    def get_absolute_url(self):
        return _urlreverse('product_detail', args=[self.slug, self.pk])

class ProductTag(BaseModel, SluggableMixin, TimeStampsMixin):

    name = models.CharField(max_length=255, verbose_name=_('Name'))
    description = models.TextField(verbose_name=_('Description'),
        null=True, blank=True)
    image = models.FileField(upload_to="images", verbose_name='Product image')
    products = models.ManyToManyField(Product, verbose_name='products')

    def __str__(self):
        return self.name

    def count_product(self):
        return self.products.count()
