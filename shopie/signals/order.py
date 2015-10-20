from django.dispatch import receiver, Signal
from shopengine.mailer import order_added_mailer

order_status_changed = Signal(providing_args=['order', 'change_from', 'change_to'])
order_added = Signal(providing_args=['user', 'order'])

@receiver(order_added)
def order_added_mailer_listener(sender, user, order, **kwargs):
    order_added_mailer(user, order, **kwargs)
