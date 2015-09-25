from django.views.generic import ListView, DetailView

from shopengine.models import Product

class ShopView(ListView):
    generic_template = "shopengine/product/product_list.html"
    paginate_by = 20

    def get_queryset(self):
        if self.request.user.is_staff:
            return Product.objects.all()
        else:
            return Product.objects.published().active()

class ShopDetailView(DetailView):
    generic_template = "shopengine/product/product_detail.html"
    model = Product
    query_pk_and_slug = True

    def get_template_names(self):
        templates = super(ShopDetailView, self).get_template_names()
        if not self.generic_template in templates:
            templates.append(self.generic_template)
        return templates
