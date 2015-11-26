from django.views.generic.base import View, TemplateResponseMixin
from django.http import (HttpResponse, HttpResponseRedirect,
    Http404, HttpResponseBadRequest, JsonResponse)
from django.core.exceptions import ObjectDoesNotExist, ValidationError
import django.contrib.messages.api as message_api
from django.core.urlresolvers import reverse

from shopie.utils.current_order import get_or_create_current_order
from shopie.froms.order import get_current_order_item_formset
from shopie.models import Order

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
        pass

