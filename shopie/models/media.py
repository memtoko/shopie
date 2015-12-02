from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse

from .base import BaseModel, TimeStampsMixin, SluggableMixin
from shopie.utils.users import user_model_string

class MediaQuerySet(models.QuerySet):

    def public(self):
        return self.filter(is_public=True)

    def private(self):
        return self.filter(is_public=False)

    def for_user(self, user):
        return self.filter(user=user)

class Media(BaseModel,TimeStampsMixin, SluggableMixin):
    name = models.CharField(max_length=255, verbose_name=_('Product Name'), blank=True)
    description = models.TextField(verbose_name=_('Descriptions'), blank=True)
    file = models.FileField(_("File"))
    user = models.ForeignKey(user_model_string(), blank=True, null=True,
        verbose_name=_('owner'))
    is_public = models.BooleanField(default=False, verbose_name=_('is public'))
    objects = MediaQuerySet.as_manager()

    def save(self, **kwargs):
        if not self.name:
            self.name = self.file.name

        if not self.slug:
            self.set_slug(self.name)

        super(Media, self).save(**kwargs)
