import uuid
from django.db import models
from django.utils.translation import ugettext_lazy as _

class BaseModel(models.Model):
    uuid = models.UUIDField(verbose_name=_('UUID'))

    def save(self, **kwargs):
        if not self.uuid:
            self.uuid = uuid.uuid4()
        super(BaseModel, self).save(**kwargs)

    class Meta:
        abstract= True
