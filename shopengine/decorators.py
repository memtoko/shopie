from functools import wraps
from django.utils.decorators import available_attrs
from django.http import HttpResponseRedirect
import django.shortcuts as _shortcut
from django.core.urlresolvers import reverse

from shopengine.cart.bucket import get_or_create_cart
from shopengine.models import Order

def cart_nonempty_required(url_name='home'):
    """Decorator for view that only accept non empty cart, otherwise redirect"""
    def _decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped(request, *args, **kwargs):
            cart = get_or_create_cart(request)
            items = cart.items.all().exists()
            if items:
                return view_func(request, *args, **kwargs)
            return _shortcut.redirect(reverse(url_name))
        return _wrapped
    return _decorator

def order_passed_test(testfunc=None, url_name=None, order_factory=None):
    def _decorator(view_func):
        @wraps(view_func, assigned=available_attrs(view_func))
        def inner(request, *args, **kwargs):
            order = None
            if order_factory is not None:
                order = order_factory(request)
            else:
                session = getattr(request, 'session', None)
                if session is not None:
                    order_key = session.get('_order_key', None)
                    if order_key is not None:
                        order = Order.objects.get(order_key=order_key)
            if order is None:
                raise ValueError("cant retrieve order from request")
            else:
                if testfunc(order):
                    return view_func(request, *args, **kwargs)
                return HttpResponseRedirect(reverse(url_name))
        return inner
    return _decorator

def order_completed_required(func=None, url_name=None, order_factory=None):
    factory = order_factory or Order.objects.get_order_from_request
    actual_decorator = order_passed_test(
            lambda o: o is not None and o.status == Order.COMPLETED,
            url_name=url_name,
            order_factory=factory
        )
    if func:
        return actual_decorator(func)
    return actual_decorator

def order_session_required(func=None, url_name='cart', order_factory=None):
    factory = order_factory or Order.objects.get_order_from_request
    actual_decorator = order_status_passed_test(
            lambda o: o is not None and o.status <= Order.COMPLETED,
            url_name=url_name,
            order_factory=factory
        )
    if func:
        return actual_decorator(func)
    return actual_decorator
