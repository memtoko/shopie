import uuid
import datetime

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from shopie.utils.text import slugify

class BaseModel(models.Model):
    uuid = models.UUIDField(verbose_name=_('UUID'), default=uuid.uuid4)

    class Meta:
        abstract = True

class SluggableMixin(models.Model):
    slug = models.CharField(max_length=250, verbose_name=_("Slug"))

    def set_slug(self, base):
        if not self.slug:
            self.slug = slugify(base)

    class Meta:
        abstract = True

class TimeStampsMixin(models.Model):
    """Timestamps for the model. I added database index to both created_at
    and updated_at, as i always found to orderby them.

    I am not use auto_now or auto_now_add because there are can't be used
    when use fixture, as we should provide created_at and updated_at
    """
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(default=timezone.now, db_index=True)

    def save(self, **kwargs):
        self.updated_at = timezone.now()
        super(TimeStampsMixin, self).save(**kwargs)

    class Meta:
        abstract = True
