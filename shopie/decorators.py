from functools import wraps
from django.utils.decorators import available_attrs
from django.http import HttpResponseRedirect
import django.shortcuts as _shortcut
from django.core.urlresolvers import reverse

from shopie.utils.current_order import get_or_create_current_order
from shopie.models import Order

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
                    order_id = session.get('order_id', None)
                    if order_id is not None:
                        order = Order.objects.get(pk=order_id)
            if order is None:
                raise ValueError("cant retrieve order from request")
            else:
                if testfunc(order):
                    return view_func(request, *args, **kwargs)
                return HttpResponseRedirect(reverse(url_name))
        return inner
    return _decorator

def order_status_required(func=None, url_name=None, order_factory=None,
    status=Order.STATE_ACCEPTED):
    factory = order_factory or get_or_create_current_order
    actual_decorator = order_passed_test(
            lambda o: o is not None and o.status == status,
            url_name=url_name,
            order_factory=factory
        )
    if func:
        return actual_decorator(func)
    return actual_decorator

def order_nonempty_required(func=None, url_name=None, order_factory=None):
    factory = order_factory or get_or_create_current_order
    actual_decorator = order_passed_test(
            lambda o: o is not None and not o.is_empty,
            url_name=url_name,
            order_factory=factory
        )
    if func:
        return actual_decorator(func)
    return actual_decorator

def order_session_required(func=None, url_name='shopie:shop', order_factory=None):
    factory = order_factory or get_or_create_current_order
    actual_decorator = order_passed_test(
            lambda o: o is not None and o.status <= Order.STATE_RECEIVED,
            url_name=url_name,
            order_factory=factory
        )
    if func:
        return actual_decorator(func)
    return actual_decorator
