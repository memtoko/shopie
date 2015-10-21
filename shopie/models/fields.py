from decimal import Decimal
from django.db.models.fields import DecimalField

class CurrencyField(DecimalField):
    """
    A CurrencyField is simply a subclass of DecimalField with a fixed format:
    max_digits = 30, decimal_places=2, and defaults to 0.00
    """
    def __init__(self, *args, **kwargs):
        defaults = {
            'max_digits': 30,
            'decimal_places': 2,
            'default': Decimal('0.00')
        }
        defaults.update(kwargs)
        super(CurrencyField, self).__init__(**defaults)
