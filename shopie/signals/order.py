from django.dispatch import receiver, Signal
from shopie.mailer import order_added_mailer

order_status_changed = Signal(providing_args=['order', 'change_from', 'change_to'])
order_added = Signal(providing_args=['user', 'order'])
order_confirmed = Signal(providing_args=['order'])
