from datetime import datetime, timezone
from decimal import Decimal
from .modifier import BaseModifier
from shopengine.models import Disscount

class DisscountModifier(BaseModifier):

    def get_extra_cart_price_field(self, cart, request):
        session = getattr(request, 'session', None)
        if session is not None:
            disscount_code = session.get('_disscount_code', None)
            if disscount_code:
                return self._apply_disscount_code(disscount_code, cart)
        return False

    def _apply_disscount_code(self, disscount_code, cart):
        disscount = Disscount.objects.filter(code=disscount_code).last()
        if all([disscount, self._validate_disscount(disscount, cart)]):
            if disscount.discount_type == 10:
                return ('Disscount', Decimal(0 - disscount.amount))
            else:
                amount = Decimal(cart.total_price * amount / 100)
                return ('Disscount', amount)
        return False

    def _validate_disscount(self, disscount, cart):
        now = datetime.now(tz=timezone.utc)
        if disscount.end_date < now > disscount.start_date:
            return False
        temp_used = disscount.used + 1
        if disscount.max_used < temp_used:
            return False
        return True
