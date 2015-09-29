from django.views.generic import ListView, DetailView

from .base import ShopViewMixins
from shopengine.models import Product

class ShopView(ShopViewMixins, ListView):
    generic_template = "shopengine/product/product_list.html"
    paginate_by = 20

    def get_queryset(self):
        queryset = Product.objects.exclude(product_type=Product.VARIANT_PRODUCT)
        if self.request.user.is_staff:
            return queryset.all()
        else:
            return queryset.published().active()

class ShopDetailView(ShopViewMixins, DetailView):
    generic_template = "shopengine/product/product_detail.html"
    model = Product
    query_pk_and_slug = True
