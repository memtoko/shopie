import AuthenticatedRouteStaff from '../shopie-authenticated-staff';
import ShortcutsRoute from '../../mixins/shortcuts-route';

export default AuthenticatedRouteStaff.extend(ShortcutsRoute, {

  model(params) {
    var orderId,
     order,
     query;

    orderId = Number(params.order_id);
    order = this.store.peekRecord('order', orderId);
    if (order) {
      return order;
    }
    query = {
      id: orderId,
      status: 'all'
    };
    return this.store.query('order', query).then((order) => {
      if (order) {
        return order;
      }
      return this.replaceRoute('orders.index');
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('orders').set('currentOrder', model);
  }
});
