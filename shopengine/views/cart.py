from django.views.generic.base import View, TemplateResponseMixin
from django.http import (HttpResponse, HttpResponseRedirect,
    Http404, HttpResponseBadRequest, JsonResponse)
from django.core.exceptions import ObjectDoesNotExist
import django.contrib.messages.api as message_api
from django.core.urlresolvers import reverse

from shopengine.cart.bucket import get_or_create_cart, add_disscount_to_request
from shopengine.forms.cart import get_cart_item_formset, ApplyDisscountForm
from shopengine.models import Product, Disscount

class CartItemDetail(View):
    """
    A view to handle CartItem-related operations. This is not a real view in
    the sense that it is not designed to answer to GET or POST request nor to
    display anything, but only to be used from AJAX.
    """
    action = None

    def dispatch(self, request, *args, **kwargs):
        if not self.action:
            return super(CartItemDetail, self).dispatch(request,
                *args, **kwargs)
        if self.action in self.http_method_names:
            handler = getattr(self, self.action, self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        self.request = request
        self.args = args
        self.kwargs = kwargs
        return handler(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        cart = get_or_create_cart(self.request)
        item_id = self.kwargs.get('id')
        try:
            quantity = int(self.request.POST['item_quantity'])
        except (KeyError, ValueError):
            response = HttpResponseBadRequest('The quantity has to be a number')
        else:
            cart.update_quantity(item_id, quantity)
            response = self.put_success()
        # return response
        return response

    def delete(self, request, *args, **kwargs):
        cart = get_or_create_cart(self.request)
        item_id = kwargs.get('id')
        try:
            cart.delete_item(item_id)
        except ObjectDoesNotExist:
            raise Http404
        else:
            return self.delete_success()

    def success(self):
        if self.request.is_ajax():
            return JsonResponse({'status': 'OK'})
        else:
            return HttpResponseRedirect(reverse('cart'))

    def delete_success(self):
        return self.success()

    def post_success(self, product, cart_item):
        return self.success()

    def put_success(self):
        return self.success()

class CartView(TemplateResponseMixin, CartItemDetail):

    template_name = "shopengine/cart.html"
    action = None

    def get_context_data(self, **kwargs):
        ctx = {}
        cart = get_or_create_cart(self.request)
        cart.update(self.request)
        ctx.update({
                'cart': cart,
                'cart_items': cart.get_updated_cart_items()
            })
        return ctx

    def get(self, request, *args, **kwargs):
        """
        This is lifted from the TemplateView - we don't get this behavior since
        this only extends the mixin and not templateview.
        """
        context = self.get_context_data(**kwargs)
        formset = get_cart_item_formset(cart_items=context['cart_items'])
        disscount_form = ApplyDisscountForm()
        context.update({'formset': formset, 'disscount_form': disscount_form})
        return self.render_to_response(context)

    def post(self, *args, **kwargs):
        """
        This is to *add* a new item to the cart. Optionally, you can pass it a
        quantity parameter to specify how many you wish to add at once
        (defaults to 1)
        """
        try:
            product_id = int(self.request.POST['add_item_id'])
            product_quantity = int(self.request.POST.get('add_item_quantity', 1))
        except (KeyError, ValueError):
            message_api.warning(self.request, 'error, silahkan pilih product')
            return HttpResponseRedirect(reverse('cart'))

        product = Product.objects.get(pk=product_id)
        cart = get_or_create_cart(self.request, save=True)
        cart_item = cart.add_product(product, product_quantity)
        cart.save()
        return self.post_success(product, cart_item)

    def delete(self, *args, **kwargs):
        """
        Empty shopping cart.
        """
        cart_object = get_or_create_cart(self.request)
        cart_object.empty_cart()
        return self.delete_success()

    def put(self, *args, **kwargs):
        """
        Update shopping cart items quantities.

        Data should be in update_item_ID=QTY form, where ID is id of cart item
        and QTY is quantity to set.
        """
        context = self.get_context_data(**kwargs)
        try:
            formset = get_cart_item_formset(cart_items=context['cart_items'],
                    data=self.request.POST)
        except ValidationError:
            return redirect('cart')
        if formset.is_valid():
            formset.save()
            return self.put_success()
        context.update({'formset': formset, })
        return self.render_to_response(context)

class DisscountView(CartItemDetail):

    def post(self, *args, **kwargs):
        form = ApplyDisscountForm(data=self.request.POST or None)
        if form.is_valid():
            disscount = Disscount.objects.filter(
                    code=form.cleaned_data.get('code')
                ).last()
            add_disscount_to_request(self.request, disscount)
        else:
            message_api.warning('Maaf, kode tidak valid. :(')
        redirect = self.request.GET.get('next', None) or self.request.POST.get('next', None)
        return HttpResponseRedirect(redirect)
