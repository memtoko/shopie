from django.db import models
from django.conf import settings
try:
    USER_MODEL = settings.AUTH_USER_MODEL
except AttributeError:
    USER_MODEL = 'django.contrib.auth.models.User'

class UserProfile(models.Model):
    user = models.OneToOneField(USER_MODEL)
    full_name = models.CharField(max_length=200, blank=True)
    bio = models.CharField(max_length=200, blank=True)
    
    def __str__(self):
        return self.full_name or str(self.user)
