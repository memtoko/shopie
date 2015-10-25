"""Product and related product models."""

import os
from datetime import datetime, timezone
from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse

from .base import BaseModel, SluggableMixin, TimeStampsMixin
from .fields import CurrencyField
from shopie.utils.text import slugify
from shopie.utils.users import user_model_string

def _normalize_dir(dir_name):
    """include dot on the front, redundant but it usefull"""
    if not dir_name.startswith('./'):
        dir_name = os.path.join('.', dir_name)
    if dir_name.endswith("/"):
        dir_name = dir_name[:-1]
    return dir_name

def product_file_upload(instance, filename):
    """We use this to customize upload file for our product"""
    updir = getattr(settings, 'PRODUCT_UPLOAD_DIR')
    updir = os.path.normpath(_normalize_dir(updir))
    return os.path.join(updir, instance.file.field.get_filename(filename))

class ProductQuerySet(models.QuerySet):

    def active(self):
        return self.filter(is_active=True)

    def published(self):
        return self.filter(status=AbstractProduct.STATUS_PUBLISHED)

    def where_author(self, author):
        return self.filter(author=author)

    def root(self):
        """All products which are not variant"""
        return self.filter(parent=None)

class AbstractProduct(TimeStampsMixin, SluggableMixin, BaseModel):
    """An abstract product that can be used to create product spec on an
    ecommerce site.

    This implementation of parent-variant product is recursive, that is the
    model have relation to itself.

    - A variant product can be determined by the field parent is not None.
    - A parent product can be determined by the field parent is None (:stored as
    null on database.) and it should atleast have 1 variant. If not, we treat the
    product as-is.
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
    unit_price = CurrencyField(verbose_name=_('Unit Price'), blank=True,
        default=Decimal('0.00'))
    # Control available
    is_active = models.BooleanField(default=False, verbose_name=_('Active'))
    status = models.IntegerField(choices=PRODUCT_STATUSES, default=STATUS_DRAFT,
        verbose_name=_('Status'))
    # simple implementation of product variant
    parent = models.ForeignKey('self', verbose_name=_('Product Parent'),
        blank=True, null=True)
    objects = ProductQuerySet.as_manager()

    def get_variants(self):
        """we can't access the manager on object level, so self.objects not work,
        but clsname.objects will work
        """
        cls = self.__class__
        return cls.objects.filter(parent=self)

    def get_price(self):
        return self.price

    @property
    def price(self):
        return min([v.unit_price for v in self.get_variants()]) if self.is_parent else self.unit_price

    @property
    def has_variant(self):
        return self.get_variants().exists()

    @property
    def is_variant(self):
        return self.parent is not None

    @property
    def is_parent(self):
        """Alias for has variant"""
        return self.parent is None and self.has_variant

    @property
    def orderable(self):
        return all([
            self.is_active,
            self.status == self.STATUS_PUBLISHED,
            not self.is_parent
        ])

    class Meta:
        abstract = True

    def save(self, **kwargs):
        # then check it if it variant
        if self.parent:
            # this product has parent so it should variant, in that case change
            # the unit price of parent to 0
            if self.parent.unit_price != Decimal('0.00'):
                self.parent.unit_price = Decimal('0.00')
                self.parent.save()

        if not self.slug:
            self.set_slug(self.name)

        super(AbstractProduct, self).save(**kwargs)

    @property
    def fullname(self):
        return "%s (%s)" % (self.parent.name, self.name) if self.parent else self.name

class Product(AbstractProduct):
    """This is the actual product we use on our website.
    """
    # if you pass None to this field, they will interpreted as unlimited
    activation_limit = models.IntegerField(blank=True, null=True,
        help_text=_("Activation limit for this product"), default=1)
    license_expiry = models.IntegerField(blank=True, null=True, default=1)

    file = models.FileField(_("File"), upload_to=product_file_upload)
    image = models.FileField(upload_to="images", verbose_name='Product image')

    class Meta(object):
        verbose_name = _('Product')
        verbose_name_plural = _('Products')

    def get_absolute_url(self):
        return _urlreverse('product_detail', args=[self.slug, self.pk])

class ProductTag(BaseModel, SluggableMixin, TimeStampsMixin):

    name = models.CharField(max_length=255, verbose_name=_('Name'))
    description = models.TextField(verbose_name=_('Description'), blank=True,
        default='')
    image = models.FileField(upload_to="images", verbose_name='Product image')
    products = models.ManyToManyField(Product, verbose_name='products')

    def __str__(self):
        return self.name

    def count_product(self):
        return self.products.count()
