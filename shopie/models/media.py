from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from .base import BaseModel, SluggableMixin, TimeStampsMixin
from shopie.utils.users import user_model_string

class MediaQuerySet(models.QuerySet):

    def public(self):
        return self.filter(is_public=True)

    def private(self):
        return self.filter(is_public=False)

    def owner(self, owner):
        return self.filter(owner=owner)

class Media(BaseModel, SluggableMixin, TimeStampsMixin):
    name = models.CharField(max_length=255, verbose_name=_('name'), blank=True)
    description = models.TextField(null=True, blank=True,
        verbose_name=_('description'))
    file = models.FileField(verbose_name=_("File"))
    owner = models.ForeignKey(user_model_string(), blank=True, null=True,
        verbose_name=_('Author'))
    is_public = models.BooleanField(default=True, verbose_name=_('Public'))

    objects = MediaQuerySet.as_manager()

    def save(self, **kwargs):
        if not self.name:
            self.name = self.file.name
        if not self.slug:
            self.set_slug(self.name)
        super(Media, self).save(**kwargs)
