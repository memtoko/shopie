from django.conf.urls import url

from shopie.views.issue import IssueListView, IssueDetailView

urlpatterns = [
    url(r'^product/(?P<slug>[^\.]+)-(?P<pk>\d+)/issues/$', IssueListView.as_view(),
        name="product_issues"),
    url(r'^product/(?P<product_slug>[^\.]+)-(?P<product_pk>\d+)/issues/(?P<pk>\d+)/', IssueDetailView.as_view(),
        name="issue_detail")
]
