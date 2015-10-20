from django.conf.urls import patterns, url

from shopengine.views.issue import IssueListView, IssueDetailView

urlpatterns = patterns('',
    url(r'^product/(?P<slug>[^\.]+)-(?P<pk>\d+)/issues/$', IssueListView.as_view(),
        name="product_issues"),
    url(r'^issue/(?P<slug>[^\.]+)-(?P<pk>\d+)/$', IssueDetailView.as_view(),
        name="issue_detail")
)
