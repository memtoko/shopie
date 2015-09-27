from shopengine.cart.bucket import get_or_create_cart
"""List of context processors for shop engine"""

def cart(request):
    bucket = get_or_create_cart(request)
    bucket.update(request)
    return {
        'cart': bucket,
        'cart_items': bucket.get_updated_cart_items()
    }
