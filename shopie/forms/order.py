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
