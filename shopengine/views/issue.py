from django.views.generic import ListView, DetailView
from django.http import (HttpResponse, HttpResponseRedirect,
    Http404, HttpResponseBadRequest, JsonResponse)
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core.urlresolvers import reverse
import django.contrib.messages.api as message_api

from .base import ShopViewMixins
from shopengine.models import Product, Issue
from shopengine.forms.issue import IssueCreationForm, ReplyCreationForm

class IssueListView(ShopViewMixins, ListView):
    model = Issue
    ordering = "updated_at"
    generic_template = "shopengine/issue/issue_list.html"
    paginate_by = 20
    query_pk_and_slug = True

    def get_queryset(self):
        if self.queryset is not None:
            queryset = self.queryset
        else:
            slug, pk = [self.kwargs.get('slug', None), self.kwargs.get('pk', None)]
            if pk is None and slug is None:
                raise AttributeError("%s must be called with either slug and pk"
                    % self.__class__.name)
            try:
                queryset = Issue.objects.for_product(pk=pk, slug=slug)
            except Product.DoesNotExist:
                raise Http404("Issue for product doesnot exists yet.")
        return queryset

    def get_context_data(self, **kwargs):
        ctx = super(IssueListView, self).get_context_data(**kwargs)
        if self.request.user and not isinstance(self.request.user, AnonymousUser):
            form = IssueCreationForm()
            ctx.update({
                    'form_issue': form
                })
        # try to get the the product
        issues = ctx.get('object_list', None)
        if issues is not None:
            issue = issues[0]
            product = getattr(issue, 'product', None)
            if product is not None:
                ctx.update({
                        'product': product
                    })
        return ctx

    @method_decorator(login_required)
    def post(self, *args, **kwargs):
        try:
            product_pk = int(self.request.POST['product_pk'])
            product = Product.objects.get(pk=pk)
        except (KeyError, ValueError, Product.DoesNotExist):
            return HttpResponseBadRequest("Bad request input")
        issue = Issue(product=product, user=self.request.user)
        form = IssueCreationForm(self.request.POST or None, instance=issue)
        if form.is_valid():
            issue = form.save()
            return HttpResponseRedirect(
                    reverse("issue_detail",
                    kwargs={
                        'slug':issue.slug,
                        'pk':issue.pk
                    }))
        else:
            message_api.warning(self.request, "Ups, form input tidak valid.")
            return HttpResponseRedirect(
                reverse('product_issues',
                kwargs={
                    'slug': product.slug,
                    'pk': product.pk
                }))

class IssueDetailView(ShopViewMixins, DetailView):

    generic_template = "shopengine/issue/issue_detail.html"
    model = Issue

    def get_context_data(self, **kwargs):
        ctx = super(IssueDetailView, self). get_context_data(**kwargs)
        replies = Reply.objects.filter(issue=ctx.get('object'))
        ctx.update({
            'replies': replies
        })
        return ctx

    @method_decorator(login_required)
    def post(self, *args, **kwargs):
