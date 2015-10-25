from django.views.generic import ListView, DetailView

from .base import ShopViewMixins
from shopie.models import Product

class ShopView(ShopViewMixins, ListView):
    generic_template = "shopie/product/product_list.html"
    paginate_by = 20

    def get_queryset(self):
        queryset = Product.objects.root()
        if self.request.user.is_staff:
            queryset = queryset.all()
        else:
            queryset = queryset.published().active()
        return queryset

class ShopDetailView(ShopViewMixins, DetailView):
    generic_template = "shopie/product/product_detail.html"
    model = Product
    query_pk_and_slug = True
