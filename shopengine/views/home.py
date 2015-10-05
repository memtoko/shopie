from django.shortcuts import render
from django.contrib.auth.models import AnonymousUser
from django.contrib.staticfiles.storage import staticfiles_storage

def home_view(request, logged_view=None):
    is_logged_in = request.user and not isinstance(request.user, AnonymousUser)

    ctx = {
        'body_id': 'home',
        'navbar_class': 'navbar-default',
        'navbar_collapse': 'home-nav',
        'header_class': 'home services',
        'header_images': [
            staticfiles_storage.url("images/home15.jpg"),
            staticfiles_storage.url("images/home14.jpg"),
            staticfiles_storage.url("images/home13.jpg"),
        ]
    }
    if is_logged_in:
        # if logged in we will display dashboard
        if logged_view is not None:
            return logged_view(request)
        else:
            return render(request, 'home.html', ctx)
    else:
        # none logged in user
        return render(request, 'home.html', ctx)
