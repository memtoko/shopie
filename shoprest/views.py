from .api import api
from tastypie.authorization import Authorization
from tastypie import fields
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS

from shopengine.utils.users import user_model
from shopengine.models import Order, OrderItem, OrderPayment
User = user_model()

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        excludes = ['password', 'is_superuser', 'is_staff']
        always_return_data = True
        filtering = {
            'username': ALL
        }

class OrderResource(ModelResource):
    class Meta:
        queryset = Order.objects.all()
        resource_name = 'order'
        excludes = ['cart_pk']
        always_return_data = True

class OrderItemResource(ModelResource):
    class Meta:
        queryset = OrderItem.objects.all()
        resource_name = 'order_item'
        always_return_data = True

class OrderPaymentResource(ModelResource):
    class Meta:
        queryset = OrderPayment.objects.all()
        resource_name = 'order_payment'
        always_return_data = True

api.register(UserResource())
api.register(OrderResource())
api.register(OrderItemResource())
api.register(OrderPaymentResource())
