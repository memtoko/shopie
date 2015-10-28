from django.conf.urls import patterns, url
from django.views.generic import TemplateView

urlpatterns = patterns('',
    url(r'^shopie/$', TemplateView.as_view(template_name='shopie/admin.html'), name="admin_index"),
    url(r'^shopie/.*/$', TemplateView.as_view(template_name='shopie/admin.html'), name="admin"),
)
