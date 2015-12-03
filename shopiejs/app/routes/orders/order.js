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
      order.get('items'); // force reload
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
  },

  setupController(controller, model) {
    this._super(controller, model);
    Ember.run.scheduleOnce('afterRender', this, function () {
      this.controllerFor('orders').set('currentOrder', model);
    });
  },

  shortcuts: {
    'enter, o': 'openEditor',
    'c, q, x': 'cancelEdit',
    'command+backspace, ctrl+backspace': 'deleteOrder'
  },

  actions: {
    openEditor(order) {
      order = order || this.get('controller.model');

      if (!order) {
        return;
      }

      this.get('controller').send('toggleEditMode');
    },

    cancelEdit(order) {
      order = order || this.get('controller.model');

      if (!order) {
        return;
      }

      this.get('controller').send('cancelEdit');
    },

    deleteOrder(order) {
      this.send('openModal', 'delete-order', this.get('controller.model'));
    }
  }
});
