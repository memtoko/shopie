from django.views.generic import ListView, DetailView
from django.http import (HttpResponse, HttpResponseRedirect,
    Http404, HttpResponseBadRequest, JsonResponse)
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.core.urlresolvers import reverse
import django.contrib.messages.api as message_api

from .base import ShopViewMixins
from shopie.models import Product, Issue
from shopie.forms.issue import IssueCreationForm, ReplyCreationForm

class IssueListView(ShopViewMixins, ListView):

    model = Issue
    ordering = "updated_at"
    generic_template = "shopie/issue/issue_list.html"
    paginate_by = 20
    query_pk_and_slug = True
    product = None

    def get_queryset(self):
        if self.queryset is not None:
            queryset = self.queryset
        else:
            slug, pk = [self.kwargs.get('slug', None), self.kwargs.get('pk', None)]
            if pk is None and slug is None:
                raise AttributeError("%s must be called with either slug and pk"
                    % self.__class__.name)
            try:
                product = Product.objects.get(pk=pk, slug=slug)
            except Product.DoesNotExist:
                raise Http404("Issue for product doesnot exists yet.")
            else:
                self.product = product
                queryset = product.issues.all()
        return queryset

    def get_context_data(self, **kwargs):
        ctx = super(IssueListView, self).get_context_data(**kwargs)
        if self.request.user and not isinstance(self.request.user, AnonymousUser):
            form = IssueCreationForm()
            ctx.update({
                    'form_issue': form
                })
        if self.product is not None:
            ctx.update({
                    'product': self.product
                })
        return ctx

    @method_decorator(login_required)
    def post(self, *args, **kwargs):
        try:
            product_pk = int(self.request.POST['product_pk'])
            product = Product.objects.get(pk=product_pk)
        except (KeyError, ValueError, Product.DoesNotExist):
            return HttpResponseBadRequest("Bad request input")
        issue = Issue(target=product, user=self.request.user)
        form = IssueCreationForm(self.request.POST or None, instance=issue)
        if form.is_valid():
            issue = form.save()
            return HttpResponseRedirect(
                    reverse("shopie:issue_detail",
                    kwargs={
                        'product_slug':product.slug,
                        'product_pk': product.pk,
                        'pk':issue.pk
                    }))
        else:
            message_api.warning(self.request, "Ups, form input tidak valid.")
            return HttpResponseRedirect(
                reverse('shopie:product_issues',
                kwargs={
                    'slug': product.slug,
                    'pk': product.pk
                }))

class IssueDetailView(ShopViewMixins, DetailView):

    generic_template = "shopie/issue/issue_detail.html"
    model = Issue

    def get_context_data(self, **kwargs):
        ctx = super(IssueDetailView, self).get_context_data(**kwargs)
        issue = ctx.get('object')
        replies = issue.replies.all()
        ctx.update({
            'replies': replies
        })
        return ctx

    @method_decorator(login_required)
    def post(self, *args, **kwargs):
        pass
