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
      return order;
    }
    query = {
      id: orderId,
      status: 'all'
    };
    return this.store.query('order', query).then((order) => {
      if (order && order.get('status') > 20) {
        return order;
      }
      return this.replaceRoute('orders.index');
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    Ember.run.scheduleOnce('afterRender', this, function () {
      this.controllerFor('orders').set('currentOrder', model);
    });
  },

  actions: {

    openEditor(order) {
      order = order || this.get('controller.model');

      if (!order) {
        return;
      }

      this.transitionTo('orders.edit', order.get('id'));
    },

    deleteOrder(order) {
      this.send('openModal', 'delete-order', this.get('controller.model'));
    }
  }
});
