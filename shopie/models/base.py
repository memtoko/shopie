import uuid
from django.db import models
from django.utils.translation import ugettext_lazy as _
from shopie.utils.text import slugify

class BaseModel(models.Model):
    uuid = models.UUIDField(verbose_name=_('UUID'))

    def save(self, **kwargs):
        if not self.uuid:
            self.uuid = uuid.uuid4()
        super(BaseModel, self).save(**kwargs)

    class Meta:
        abstract= True

class SluggableMixin(models.Model):
    slug = models.CharField(max_length=250, verbose_name=_("Slug"))

    def set_slug(self, base):
        if not self.slug:
            self.slug = slugify(base)

    class Meta:
        abstract = True

class TimeStampsMixin(models.Model):
    """Timestamps for the model. I added database index to bot created_at
    and updated_at, as i always found to orderby them.
    """
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        abstract = True
