from django.db import models
from django.conf import settings
from django.db.models.signals import post_save

from shopengine.utils.users import user_model

try:
    USER_MODEL = settings.AUTH_USER_MODEL
except AttributeError:
    USER_MODEL = 'django.contrib.auth.models.User'

class UserProfile(models.Model):
    user = models.OneToOneField(USER_MODEL)
    full_name = models.CharField(max_length=200, blank=True)
    bio = models.CharField(max_length=200, blank=True)
    website = models.URLField(blank=True)
    status = models.CharField(max_length=200, default='active')

    def __str__(self):
        return self.full_name or str(self.user)

def create_user_profile_listener(sender, instance=None, created=False, **kwargs):
    User = user_model()
    if created and isinstance(instance, User):
        # try to see if this user already have profile
        if not UserProfile.objects.filter(user=instance).exists():
            full_name = instance.first_name + ' ' + instance.last_name
            UserProfile.objects.create(user=instance, full_name=full_name)
# connect it
post_save.connect(create_user_profile_listener, dispatch_uid='account.profile.model')
