import uuid
from datetime import timedelta

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse
from django.utils import timezone

from .base import BaseModel, TimeStampsMixin
from .product import Product
from .order import Order
from shopie.utils.users import user_model_string
from shopie.signals import order_acceptance
from shopie.utils.text import slugify

class LicenseManager(models.Manager):

    def _generate_license_key(self, item):
        name = slugify(item.product.name).lower()
        return '%s-%s' % (name, uuid.uuid4())

    def create_license(self, item):
        #check if it already processing
        queryset = self.get_queryset()
        if not queryset.filter(order=item.order, product=item.product).exists():
            product = item.product
            license_key = self._generate_license_key(item)
            # license_expiry defined on product is per year
            _days = product.license_expiry * 365
            expired_at = timezone.now() + timedelta(days=_days)
            del _days

            self.create(
                user=order.user,
                license_key=license_key,
                active_remaining=activation_limit,
                expired_at=expired_at,
                product=product,
                order=item.order
            )

class License(TimeStampsMixin, BaseModel):
    # Create your models here.
    LICENCE_STATUSE_INACTIVE = 10
    LICENCE_STATUSE_ACTIVE = 20

    LICENCE_STATUSES = (
        (LICENCE_STATUSE_INACTIVE, 'inactive'),
        (LICENCE_STATUSE_ACTIVE, 'active'),
    )

    license_key = models.CharField(max_length=255, unique=True,
        verbose_name=_('license key'))
    user = models.ForeignKey(user_model_string(),
        verbose_name=_('License owner'))
    status = models.IntegerField(choices=LICENCE_STATUSES,
        default=LICENCE_STATUSE_INACTIVE)
    active_remaining = models.IntegerField(null=True, blank=True,
        verbose_name=_('activate remaining'))
    activate_count = models.IntegerField(default=0,
        verbose_name=_('Count activation'))
    expired_at = models.DateTimeField(blank=True, null=True)
    product = models.ForeignKey(Product)
    order = models.ForeignKey(Order)

    objects = LicenseManager()

    def __str__(self):
        return self.license_key

    @property
    def is_expired(self):
        return self.expired_at < timezone.now()

class LicenseActivation(TimeStampsMixin, BaseModel):
    license = models.ForeignKey(License)
    site = models.CharField(max_length=255, verbose_name=_('site'))
    status = models.IntegerField(choices=License.LICENCE_STATUSES,
        default=License.LICENCE_STATUSE_ACTIVE)

    def __str__(self):
        return '%s - %s' % (self.site, self.status)

def create_license_on_acceptance(sender, order, **kwargs):
    for item in order.items.all():
        License.objects.create_license(order_item=item)
order_acceptance.connect(create_license_on_acceptance, dispatch_uid='shopie.models.license')
