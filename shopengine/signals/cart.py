from django.dispatch import receiver, Signal

cart_created = Signal(providing_args=[request, cart])
cart_deleted = Signal(providing_args=[request, cart])
