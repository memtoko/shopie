from contextlib import ContextDecorator
import weakref

from shopengine.utils.backend_pool import BaseBackendPool

class CartModifierPool(BaseBackendPool):
    CONSTANT_SETTINGS = 'SHOP_CART_MODIFIERS'

class ContextModifier(ContextDecorator):

    def __init__(self, modifiers, cart, request):
        self._modifiers = modifiers
        ref = weakref.ref
        self._cart = ref(cart)
        self._request = ref(request)

    def __enter__(self):
        for mod in self._modifiers:
            mod.pre_process_cart(self._cart(), self._request())

    def __exit__(self, *exc):
        for mod in self._modifiers:
            mod.post_process_cart(self._cart(), self._request())

cart_modifier_pool = CartModifierPool()
