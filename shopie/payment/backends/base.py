from decimal import Decimal

from django.core.urlresolvers import reverse

from shopie.models import Order, Payment
from shopie.utils.text import create_sha1_key

class PaymentProcessingError(Exception): pass

class PaymentDeclined(PaymentProcessingError): pass

class PaymentBackendBase(object):

    backend_name = None

    def get_urls(self):
        """This method allow you to register url view, if the payment need it.

        This method should return the urlpattern, return None by default.
        """
        return None

    def get_thank_you_page(self, request):
        """Return absolute url for thank you page, like the name is used to says
        thank you to the customer. When order already completed via 'checkout'
        process, customer should be redirected to this page.
        """
        return request.build_absolute_uri(reverse('shopie:thank_you'))

    def process_order(self, order, request):
        """Process order through this payment backend, return string url where
        the user should redirected. Default to thank you page.
        """
        self.process_order_payment(order, request)
        return self.get_redirect(order, request)

    def _create_transaction_id(self, order):
        key = str(order.pk) + '-' + self.backend_name
        return create_sha1_key(key)

    def process_order_payment(self, order, request):
        """Process order payment. If error occured, raise PaymentProcessingError
        defined in this file.
        """
        pass

    def get_redirect(self, order, request):
        """Get redirect url to process order payment, if it should redirected
        to 3rd party payment, return the url here. Default return to thank you page
        """
        return self.get_thank_you_page(request)

    # actions listener
    def on_order_acceptance(self, sender, order, **kwargs):
        """This method allow you to listen when the order is accepted by store
        staff."""
        pass

    def on_order_rejection(self, sender, order, **kwargs):
        """This method allow you to listen when the order is rejected by store
        staff."""
        pass

    def on_order_confirmation(self, sender, order, **kwargs):
        """This method will fired when the order is confirmed by the customer"""
        pass
