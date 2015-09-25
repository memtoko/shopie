from django import forms
from django.forms.models import modelformset_factory
from django.utils.translation import ugettext_lazy as _
from datetime import datetime, timezone

from shopengine.models import CartItem, Disscount

class CartItemForm(forms.ModelForm):
    quantity = forms.IntegerField(min_value=0, max_value=9999)

    class Meta:
        model = CartItem
        fields = ('quantity', )

    def save(self, *args, **kwargs):
        quantity = self.cleaned_data['quantity']
        cart_item = self.instance.cart.update_quantity(self.instance.pk, quantity)
        return cart_item

def get_cart_item_formset(cart_items, data=None):
    if cart_items is None:
        raise ValueError(
            "position argument 1 for get_cart_item_formset must not None"
            )
    CartItemFormSet = modelformset_factory(CartItem, form=CartItemForm, extra=0)
    kwargs = {'queryset': cart_items, }
    form_set = CartItemFormSet(data, **kwargs)

    for form in form_set:
        for item in cart_items:
            if form.instance.pk == item.pk:
                form.instance = item
    return form_set

class ApplyDisscountForm(forms.Form):

    error_messages = {
        'invalid_disscount': _("Please enter a valid disscount code. %(code)s is"
                                "invalid."),
        'expired': _("This disscount code is valid, but it already expired.")
    }

    code = forms.CharField(
            required=True,
            widget=forms.TextInput(
                attrs={
                    'placeholder': 'Enter discount code'
                }
            ),
            help_text=_("Enter a discount code if you have one")
        )

    def __init__(self, request=None, *args, **kwargs):
        self.request = request
        super(ApplyDisscountForm, self).__init__(*args, **kwargs)

    def clean(self):
        code = self.cleaned_data.get('code')
        self.confirm_disscount_valid(code)
        return self.cleaned_data

    def confirm_disscount_valid(self, code):
        disscount = Disscount.objects.filter(code=code).last()
        if not disscount:
            raise forms.ValidationError(
                    self.error_messages['invalid_disscount'],
                    code='invalid'
                )
        now = datetime.now(tz=timezone.utc)
        if disscount.start_date > now:
            # the disscount still not started
            raise forms.ValidationError(
                    self.error_messages['invalid_disscount'],
                    code='invalid'
                )
        if disscount.end_date < now:
            raise forms.ValidationError(
                    self.error_messages['expired'],
                    code='expired'
                )
