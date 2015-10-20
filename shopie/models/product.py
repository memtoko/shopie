"""Product and related product models."""
import os
from datetime import datetime, timezone
from decimal import Decimal
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse

from .base import BaseModel
from .fields import CurrencyField
from shopengine.utils.text import slugify
from shopengine.utils.users import user_model_string

upload_dir = 'image'

class SluggableMixin(object):

    def set_slug(self, base):
        if not self.slug:
            self.slug = slugify(base)

class ProductQuerySet(models.QuerySet):

    def active(self):
        return self.filter(is_active=True)

    def published(self):
        return self.filter(status=20)

    def where_author(self, author):
        return self.filter(author=author)

    def where_product_type(self, products_type):
        return self.filter(product_type=product_type)

class Product(BaseModel, SluggableMixin):

    STATUS_DRAFT = 10
    STATUS_PUBLISHED = 20

    PRODUCT_STATUSES = (
        (STATUS_DRAFT, _('Draft')),
        (STATUS_PUBLISHED, _('Published')),
    )

    SIMPLE_PRODUCT = 10
    VARIABLE_PRODUCT = 20
    VARIANT_PRODUCT = 30
    EXTERNAL_PRODUCT = 40
    GROUPED_PRODUCT = 50

    PRODUCT_TYPES = {
        (SIMPLE_PRODUCT, 'Simple'),
        (VARIABLE_PRODUCT, 'Variable'),
        (VARIANT_PRODUCT, 'Variant'),
        (EXTERNAL_PRODUCT, 'External'),
        (GROUPED_PRODUCT, 'Grouped'),
    }

    name = models.CharField(max_length=255, verbose_name=_('Product Name'))
    slug = models.SlugField(verbose_name=_('Slug'))
    meta_description = models.CharField(max_length=255, verbose_name=_('Meta description'))
    # Product content
    short_description = models.TextField(max_length=255, verbose_name=_('Short Description'))
    description = models.TextField(verbose_name=_('Descriptions'))
    #image and thumbnail
    image = models.FileField(upload_to=upload_dir, blank=True,
        verbose_name=_('Product Image'))
    thumbnail = models.FileField(upload_to=upload_dir, blank=True,
        verbose_name=_('Product thumbnail'))
    author = models.ForeignKey(user_model_string(), blank=True, null=True,
        verbose_name=_('Author'))
    unit_price = CurrencyField(verbose_name=_('Unit Price'), default=Decimal(0))
    # Control available
    is_active = models.BooleanField(default=False, verbose_name=_('Active'))
    status = models.IntegerField(choices=PRODUCT_STATUSES, default=STATUS_DRAFT,
        verbose_name=_('Status'))

    parent = models.ForeignKey('self', verbose_name=_('Product Parent'),
        blank=True, null=True)
    product_type = models.IntegerField(choices=PRODUCT_TYPES, default=SIMPLE_PRODUCT,
        verbose_name=_('Product type'))
    # License related info
    activation_limit = models.IntegerField(blank=True, null=True)
    license_expiry = models.IntegerField(blank=True, null=True)
    # Total sales
    sales = models.IntegerField(blank=True, null=True, verbose_name = _('Sales'))
    #
    earnings = models.DecimalField(max_digits=30, decimal_places=2,
        default=Decimal('0.0'), verbose_name=_('Earnings'))
    created_at = models.DateTimeField(auto_now_add=True, null=True,
        verbose_name=_('Date added'))
    updated_at = models.DateTimeField(auto_now=True, null=True,
        verbose_name=_('Last modified'))
    objects = ProductQuerySet.as_manager()

    class Meta(object):
        verbose_name = _('Product')
        verbose_name_plural = _('Products')

    def __str__(self):
        return self.fullname

    def get_price(self):
        return self.unit_price

    def get_absolute_url(self):
        return _urlreverse('product_detail', args=[self.slug, self.pk])

    def save(self, **kwargs):
        self.set_slug(self.name)
        super(Product, self).save(**kwargs)

    @property
    def orderable(self):
        return self.status == self.STATUS_PUBLISHED and self.is_active

    def get_variants(self):
        if self.product_type == self.VARIABLE_PRODUCT:
            return Product.objects.filter(parent=self).all()
        else:
            raise ValueError

    @property
    def is_parent(self):
        return self.product_type == self.VARIABLE_PRODUCT and self.has_variant

    @property
    def has_variant(self):
        return Product.objects.filter(parent=self).exists()

    @property
    def is_variant(self):
        return self.product_type == self.VARIANT_PRODUCT

    @property
    def from_price(self):
        if not self.is_parent:
            return self.unit_price
        return min([variant.unit_price for variant in self.get_variants()])

    @property
    def fullname(self):
        if not self.is_parent:
            return self.name
        elif self.parent:
            return self.parent + '-' + self.name
        else:
            return self.name

class ProductTag(BaseModel, SluggableMixin):

    name = models.CharField(max_length=255, verbose_name=_('Name'))
    slug = models.SlugField(verbose_name=_('Slug'))
    meta_description = models.CharField(max_length=255, verbose_name=_('Meta description'),
        null=True, blank=True)
    description = models.TextField(verbose_name=_('Description'),
        null=True, blank=True)
    image = models.FileField(upload_to=upload_dir, verbose_name='Product image')
    products = models.ManyToManyField(Product, verbose_name='products')
    created_at = models.DateTimeField(auto_now_add=True,
        verbose_name=_('Date added'))
    updated_at = models.DateTimeField(auto_now=True,
        verbose_name=_('Last modified'))

    def __str__(self):
        return self.name

    def save(self, **kwargs):
        self.set_slug(self.name)
        super(ProductTag, self).save(**kwargs)

class Label(BaseModel):
    """Label for issue"""
    name = models.CharField(max_length=60, verbose_name=_('label title'))
    description = models.CharField(max_length=225,
        verbose_name=_('label description'))

class IssueQuerySet(models.QuerySet):

    def for_product(self, pk=None, slug=None):
        """Get issue based product pk or optionally product slug"""
        if pk is not None:
            query = Product.objects.filter(pk=pk)

        if slug is not None:
            query = query.filter(slug=slug)

        if pk is None and slug is None:
                raise AttributeError("Issue QuerySet %s must be called with "
                                 "either an object pk or a slug."
                                 % self.__class__.__name__)
        try:
            prod = query.get()
        except Product.DoesNotExist as e:
            raise e
        else:
            return self.filter(product=prod)

    def opened(self):
        return self.filter(is_closed=False)

    def closed(self):
        return self.filter(is_closed=True)


class Issue(BaseModel, SluggableMixin):
    product = models.ForeignKey(Product, verbose_name=_('product'))
    name = models.CharField(max_length=250)
    slug = models.CharField(max_length=250)
    body = models.TextField(max_length=10000, blank=True, null=True)
    user = models.ForeignKey(user_model_string(), verbose_name=_('user'))
    is_closed = models.BooleanField(blank=True, default=False)
    label = models.ForeignKey(Label, verbose_name=_('label'), blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = IssueQuerySet.as_manager()

    def __str__(self):
        return self.name

    def save(self, **kwargs):
        self.set_slug(self.name)
        super(Issue, self).save(**kwargs)

class Reply(BaseModel):
    issue = models.ForeignKey(Issue, verbose_name=_('issue'),
        related_name='replies')
    user = models.ForeignKey(user_model_string(), verbose_name=_('user'))
    body = models.TextField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return 'Reply to issue: %s' % self.issue.title
