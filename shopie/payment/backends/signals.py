"""we connect all signals for active payment backend in payment backend
pool. No check performed, is the order use that payment gateway or not.
It's the responsibility of payment gateway to only process their actions
if needed in these signals
"""

from shopie.signals.order import (order_confirmation, order_acceptance,
    order_rejection)
from . import payment_backend_pool

def connect():
    for backend in payment_backend_pool.get_backend_list():
        dispatch_uid = 'payment.backends.' + backend.backend_name
        # connect on order confirmation
        order_confirmation.connect(
            backend.on_order_confirmation, dispatch_uid=dispatch_uid
        )
        #connect on order acceptends
        order_acceptance.connect(
            backend.on_order_acceptance, dispatch_uid=dispatch_uid
        )
        #connect on order rejections
        order_rejection.connect(
            backend.on_order_rejection, dispatch_uid=dispatch_uid
        )
