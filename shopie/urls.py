"""shopie URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

from shopengine.views.home import home_view
from shopengine import urls as shopengine_urls
from account import urls as account_urls
from shoprest import urls as api_urls

urlpatterns = [
    url(r'^$', home_view, name='home'),
    url(r'^', include(shopengine_urls)),
    url(r'^', include(api_urls)),
    url(r'^account/', include(account_urls)),
    url(r'^console/', include(admin.site.urls)),
]
