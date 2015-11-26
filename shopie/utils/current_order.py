"""Utility function to get current order"""
from shopie.models import Order
from django.contrib.auth.models import AnonymousUser

def get_current_order_from_database(request):
    try:
        return Order.objects.get_user_bag(request.user)
    except Order.DoesNotExist:
        return None

def get_current_order_from_session(request):
    order = None
    order_id = request.session.get('order_id', None)
    if order_id is not None:
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            order = None
    return order

def get_or_create_current_order(request, save=False):
    order = None
    if not hasattr(request, '_current_order'):
        is_logged_in = request.user and not isinstance(request.user, AnonymousUser)
        if is_logged_in:
            # The user is logged in, first we will check the session
            session_order = get_current_order_from_session(request)
            if session_order and session_order.user == request.user:
                order = session_order
            elif session_order and session_order.is_empty and session_order.user != request.user:
                # the current order doesnt match with logged in user
                database_order = get_current_order_from_database(request)
                # delete this database order as it doesn't belong to user
                if database_order:
                    database_order.delete()
                # assign session order to this user
                session_order.user = request.user
                session_order.save()
                order = session_order
            else:
                order = get_current_order_from_database(request)
                if order:
                    request.session['order_id'] = order.pk
        else:
            order = get_current_order_from_session(request)

        if not order:
            if is_logged_in:
                order = Order(user=request.user)
            else:
                order = Order()

        if save and not order.pk:
            order.save()
            request.session['order_id'] = order.pk

        setattr(request, '_current_order', order)

    return getattr(request, '_current_order')
