from django.dispatch import receiver, Signal

order_status_changed = Signal(providing_args=['order', 'change_from', 'change_to'])

order_confirmation = Signal(providing_args=['order'])
order_acceptance = Signal(providing_args=['order'])
order_rejection = Signal(providing_args=['order'])
