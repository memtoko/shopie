import hashlib
import json

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core import cache
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from .models import UserProfile
from .forms import UserProfileForm

def user_model():
    try:
        from django.contrib.auth import get_user_model
        return get_user_model()
    except ImportError:
        from django.contrib.auth.models import User
        return User

USER_MODEL = user_model()

def user_dashboard(request, username):
    """Taken from djangoproject.com.

    Our account dashboard is powered by angular.js. We just have to serve this
    page.
    """
    user = get_object_or_404(USER_MODEL, username=username)
    return render(request, "account/user_dashboard.html", {
        'user_obj': user,
        'email_hash': hashlib.md5(user.email.encode('ascii', 'ignore')).hexdigest()
    })
