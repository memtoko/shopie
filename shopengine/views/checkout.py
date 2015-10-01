from django.shortcuts import render
from django.http import Http404

from shopengine.models import Order
from shopengine.forms.checkout import CheckoutForm
from shopengine.payment.checkout import CheckoutProcess

def checkout_thankyou(request, order_key):
	"""View for thank you page."""
    try:
        order = Order.objects.get(order_key=order_key)
    except Order.DoesNotExist:
        raise Http404()
    else:
        return render(request, "shopengine/payment/thank_you.html", {'order': order})
