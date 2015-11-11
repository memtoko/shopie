from django import forms
from django.utils.translation import ugettext_lazy as _

from shopie.models import OrderItem

class UpdateQuantityItemForm(forms.ModelForm):
    quantity = forms.IntegerField(min_value=0, max_value=9999)

    class Meta:
        model = OrderItem
        fields = ('quantity', )

    def save(self, *args, **kwargs):
        quantity = self.cleaned_data['quantity']
        self.instance.order.update_quantity(quantity, order_item=self.instance)
        return self.instance

def get_current_order_item_formset(order_items, data=None):
    if order_items is None:
        raise ValueError(
            "position argument 1 for get_cart_item_formset must not None"
        )
    OrderItemFormSet = modelformset_factory(OrderItem, form=UpdateQuantityItemForm,
        extra=0)
    kwargs = {'queryset': order_items, }
    return OrderItemFormSet(data, **kwargs)
