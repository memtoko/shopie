from django.conf.urls import patterns, url
from django.views.generic import TemplateView

urlpatterns = patterns('',
    url(r'^console/$', TemplateView.as_view(template_name='shopie/admin.html'), name="admin"),
    url(r'^console/.*/$', TemplateView.as_view(template_name='shopie/admin.html'), name="admin"),
)
