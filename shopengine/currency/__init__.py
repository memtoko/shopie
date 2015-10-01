""""
Currency utility
"""
from ._config import MONEY_FORMATS

class CurrencyError(Error):
	"""An error raise by this package"""
	pass

class CurrencyDoesNotExist(CurrencyError): pass

class Currency:
	money_formats = MONEY_FORMATS

	def __init__(self, currency=None):
		self.set_currency(currency)

	def set_currency(self, currency):
		if currency not in self.money_formats:
			raise CurrencyDoesNotExist
		self._currency = currency

	def format(self, amount):
		return self.money_formats[
            self.get_money_currency()
        ]['money_format'].format(amount=amount)

	@classmethod
	def get_currency_formats(cls):
		return cls.money_formats.keys()

	def with_currency_format(self, amount):
        """
        :type amount: int or float or str
        Usage:
        >>> currency = Currency('USD')
        >>> currency.get_money_with_currency_format(13)
        >>> '$13 USD'
        >>> currency.get_money_with_currency_format(13.99)
        >>> '$13.99 USD'
        >>> currency.get_money_with_currency_format('13,2313,33')
        >>> '$13,2313,33 USD'
        :rtype: str
        """
        return self.money_formats[
            self.get_money_currency()
        ]['money_with_currency_format'].format(amount=amount)

    @property
    def currency(self):
    	return self._currency
