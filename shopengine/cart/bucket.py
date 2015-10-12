from shopengine.models import Cart, Disscount
from shopengine.signals.cart import cart_created

from django.contrib.auth.models import AnonymousUser

def get_cart_from_database(request):
    """Get cart from database by its user in request. If you use this function,
    make sure that user is logged in
    """
    database_cart = Cart.objects.filter(user=request.user).select_related('user')
    return database_cart[0] if database_cart.exists() else None

def get_cart_from_session(request):
    """Take a cart from session value we stored before."""
    session_cart = None
    session = getattr(request, 'session', None)
    if session is not None:
        cart_id = session.get('cart_id')
        if cart_id:
            try:
                session_cart = Cart.objects.select_related('user').get(pk=cart_id)
            except Cart.DoesNotExist:
                # no session cart by that id, so set to None
                session_cart = None
    return session_cart

def get_or_create_cart(request, save=False):
    """Get a cart by their current condition of request. If save is set to True and
    we can't get cart from both database and current session, then we will create new
    one and save it.
    """
    cart = None

    if not hasattr(request, '_cart'):
        is_logged_in = request.user and not isinstance(request.user, AnonymousUser)

        if is_logged_in:
            #if user logged in, we will get cart from database
            session_cart = get_cart_from_session(request)
            if session_cart and session_cart.user == request.user:
                cart = session_cart
            elif session_cart and not session_cart.is_empty and session_cart.user != request.user:
                database_cart = get_cart_from_database(request)
                if database_cart:
                    #ha, this user have already cart in database, delete the old
                    database_cart.delete()
                session_cart.user = request.user
                session_cart.save()
                cart = session_cart
            else:
                cart = get_cart_from_database(request)
                if cart:
                    request.session['cart_id'] = cart.pk
        else:
            # no logged in user, take from session
            cart = get_cart_from_session(request)

        if not cart:
            # this new visit user, he might not added product to shopping cart yet
            # in that case, just create new Cart instance
            if is_logged_in:
                cart = Cart(user=request.user)
            elif getattr(request, 'session', None) is not None:
                cart = Cart()
            cart_created.send(sender=request, request=request, cart=cart)

        if save and not cart.pk:
            cart.save()
            request.session['cart_id'] = cart.pk

        setattr(request, '_cart', cart)

    cart = getattr(request, '_cart')
    return cart

def add_disscount_to_request(request, disscount):
    session = getattr(request, 'session', None)
    if session is not None:
        request.session['_disscount_code'] = disscount.code
