import AuthenticatedRouteStaff from '../shopie-authenticated-staff';
import ShortcutsRoute from '../../mixins/shortcuts-route';
import isNumber, { isFinite } from '../../utils/number-type';

export default AuthenticatedRouteStaff.extend(ShortcutsRoute, {
  model(params) {
    var orderId,
     order,
     query;

    orderId = Number(params.order_id);

    if (!isNumber(orderId) || !isFinite(orderId) || orderId % 1 !== 0 || orderId <= 0) {
      return this.transitionTo('error404', params.order_id);
    }
    order = this.store.peekRecord('order', orderId);
    if (order && order.get('status') > 20) {
      order.get('items'); // make order items loaded
      return order;
    }
    query = {
      id: orderId,
      status: 'all'
    };
    return this.store.query('order', query).then((order) => {
      if (order && order.get('status') > 20) {
        order.get('items');
        return order;
      }
      return this.replaceRoute('orders.index');
    });
  }
});
