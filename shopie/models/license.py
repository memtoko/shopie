from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse

from .base import BaseModel
from .product import Product
from .order import Order
from shopengine.utils.users import user_model_string
# Product License
class License(BaseModel):
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active_remaining = models.IntegerField(null=True, blank=True,
        verbose_name=_('activate remaining'))
    activate_count = models.IntegerField(default=0,
        verbose_name=_('Count activation'))
    expired_at = models.DateTimeField(blank=True, null=True)
    product = models.ForeignKey(Product)
    order = models.ForeignKey(Order)

    ##objects = LicenseQuerySet.as_manager()

class LicenseActivation(BaseModel):
    license = models.ForeignKey(License)
    site = models.CharField(max_length=255, verbose_name=_('site'))
    activate_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices=License.LICENCE_STATUSES,
        default=License.LICENCE_STATUSE_ACTIVE)

