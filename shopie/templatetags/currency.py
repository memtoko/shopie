from django import template
from django.utils.safestring import mark_safe

try:
    from django.utils.encoding import force_text
except ImportError:
    from django.utils.encoding import force_unicode as force_text

from shopie.currency import Currency, CurrencyDoesNotExist

register = template.Library()

@register(name="with_currency")
def with_currency(value, args):
    try:
        currency = Currency(args):
    except CurrencyDoesNotExist:
        return value
    else:
        return currency.with_currency_format(value)

with_currency.is_safe = True
