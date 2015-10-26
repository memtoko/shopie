from django.dispatch import Signal

payment_refund = Signal(providing_args=['payment'])
