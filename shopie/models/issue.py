from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse as _urlreverse
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

from shopengine.utils.users import user_model_string
from .base import BaseModel, SluggableMixin, TimeStampsMixin

class LabelQuerySet(models.QuerySet):

    def get_by_natural(self, name):
        return self.get(name=name)

class Label(BaseModel, SluggableMixin, TimeStampsMixin):
    """label are a way of categorizing issue"""
    name = models.CharField(max_length=100, verbose_name=_("The label name"),
        unique=True,)
    description = models.CharField(max_length=250,
        verbose_name=_("The label description"), blank=True,)
    issues = models.ManyToManyField(Issue, verbose_name=_("issues"), blank=True)
    objects = LabelManager.as_manager()

    class Meta:
        verbose_name = _("label")
        verbose_name_plural = _("labels")

    def __str__(self):
        return self.name

    def natural_key(self):
        return (self.name,)

class IssueQuerySet(models.QuerySet):

    def unclosed(self):
        """Return only non closed"""
        return self.filter(is_closed=False)

    def closed(self):
        return self.filter(is_closed=True)

class Issue(BaseModel, SluggableMixin, TimeStampsMixin):
    """Issue is like on git website services, such as Github or Bitbucket.

    we use this for our website to allow customer report an issue. An issue
    can be tagged to a target object, for example product.
    """
    name = models.CharField(max_length=255, verbose_name=_('Name'))
    body = models.TextField(max_length=10000, verbose_name=_("The body"))
    user = models.ForeignKey(user_model_string(), verbose_name=_("user"))
    target_content_type = models.ForeignKey(ContentType, blank=True, null=True)
    target_object_id = models.CharField(max_length=255, blank=True, null=True)
    target = GenericForeignKey('target_content_type', 'target_object_id')
    is_closed = models.BooleanField(default=False, verbose_name=_("Is close?"))

    def __str__(self):
        ctx = map(str, [
            self.target_content_type.app_label,
            self.target_content_type,
            self.name
        ])
        return "%s | %s | %s" % tuple(ctx)

    def mark_closed(self, commit=False):
        # disscussion. if it already closed raise an exception?
        if not self.is_closed:
            self.is_closed = True
            if commit:
                self.save()

    def mark_open(self, commit=False):
        if self.is_closed:
            self.is_closed = False
            if commit:
                self.save()

class Reply(BaseModel, TimeStampsMixin):
    issue = models.ForeignKey(Issue, verbose_name=_('issue'),
        related_name='replies')
    user = models.ForeignKey(user_model_string(), verbose_name=_('user'))
    body = models.TextField(max_length=10000)

    def __str__(self):
        "reply for issue %d by %s" % (self.issue.pk, self.user.username)
