from django.dispatch import receiver, Signal

cart_created = Signal(providing_args=['request', 'cart'])
cart_deleted = Signal(providing_args=['request', 'cart'])

@receiver(cart_deleted)
def reset_disscount(sender, request, cart, **kwargs):
    session = getattr(request, 'session', None)
    if session.get('_disscount_code', False):
        session.pop('_disscount_code', None)
