from django.views.generic.base import View, TemplateResponseMixin
from django.http import (HttpResponse, HttpResponseRedirect,
    Http404, HttpResponseBadRequest, JsonResponse)
from django.core.exceptions import ObjectDoesNotExist, ValidationError
import django.contrib.messages.api as message_api
from django.core.urlresolvers import reverse

from shopie.utils.current_order import get_or_create_current_order
from shopie.forms.order import get_current_order_item_formset
from shopie.models import Order, Product

class CurrentOrderItem(View):

    action = None

    def dispatch(self, request, *args, **kwargs):
        if not self.action:
            return super(CurrentOrderItem, self).dispatch(request, *args, **kwargs)
        if self.action in self.http_method_names:
            handler = getattr(self, self.action, self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        # assign this variable to view instance, so we can use them later
        self.request = request
        self.args = args
        self.kwargs = kwargs
        return handler(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        order = get_or_create_current_order(request)
        item_id = kwargs.get('item_id')
        try:
            quantity = int(request.POST['item_quantity'])
        except (KeyError, ValueError):
            response = HttpResponseBadRequest('The quantity has to be a number')
        else:
            order.update_quantity(quantity, order_item=item_id)
            response = self.put_success()
        return response

    def delete(self, request, *args, **kwargs):
        order = get_or_create_current_order(request)
        item_id = kwargs.get('item_id')
        try:
            item = order.items.get(pk=item_id)
            item.delete()
            order.save()
        except ObjectDoesNotExist:
            return Http404("%d doesnt exists" % (item_id,))
        else:
            self.delete_success()

    def success(self):
        if self.request.is_ajax():
            return JsonResponse({
                'status': 'Ok'
            })
        else:
            return HttpResponseRedirect(reverse('shopie:cart'))

    def delete_success(self):
        return self.success()

    def post_success(self, product, cart_item):
        return self.success()

    def put_success(self):
        return self.success()

class CurrentOrderView(TemplateResponseMixin, CurrentOrderItem):

    template_name = 'shopie/cart.html'
    action = None

    def get_context_data(self, **kwargs):
        ctx = {}
        order = get_or_create_current_order(self.request)
        order_items = order.items.all()
        formset = get_current_order_item_formset(order_items=order_items)
        ctx.update({
            'order': order,
            'order_items': order_items,
            'formset': formset
        })
        return ctx

    def get(self, request, *args, **kwargs):
        ctx = self.get_context_data(**kwargs)
        return self.render_to_response(ctx)

    def post(self, request, *args, **kwargs):
        try:
            product_id = int(self.request.POST['add_item_id'])
            product_quantity = int(self.request.POST.get('add_item_quantity', 1))
        except (KeyError, ValueError):
            message_api.warning(self.request, 'error, silahkan pilih product')
            return HttpResponseRedirect(reverse('shopie:cart'))

        product = Product.objects.get(pk=product_id)
        order = get_or_create_current_order(self.request, save=True)
        item = order.add_item(product, product_quantity)
        order.save()

        return self.post_success(product, item)

    def delete(self, *args, **kwargs):
        order = get_or_create_current_order(self.request)
        if order.pk:
            order.items.all().delete()
            order.delete()
        return self.delete_success()

    def put(self, *args, **kwargs):
        order = get_or_create_current_order(self.request)
        order_items = order.items.all()
        try:
            formset = get_current_order_item_formset(order_items=order_items,
                    data=self.request.POST)
        except ValidationError:
            return redirect('shopie:cart')
        if formset.is_valid():
            formset.save()
            return self.put_success()
        ctx = self.get_context_data(**kwargs)
        ctx.update({'formset': formset, })
        return self.render_to_response(ctx)
