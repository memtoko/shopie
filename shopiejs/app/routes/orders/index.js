import AuthenticatedRouteMixin from '../../mixins/authenticated-staff';
import MobileRoute from '../mobile-route';
import mobileQuery from '../../libs/mobile-query';

export default MobileRoute.extend(AuthenticatedRouteMixin, {
  noOrders: false,

  // Transition to a specific post if we're not on mobile
  beforeModel() {
    if (!mobileQuery.matches) {
      return this.goToOrder();
    }
  },

  setupController(controller, model) {
    /*jshint unused:false*/
    controller.set('noOrders', this.get('noOrders'));
  },

  goToOrder() {
    // the store has been populated by PostsRoute
    var orders = this.store.peekAll('order'),
      order;

    order = orders.find(function (order) {
      return order && order.get('status') > 20;
    });

    if (order) {
      return this.transitionTo('orders.order', order);
    }

    this.set('noOrders', true);
  },

  // Mobile posts route callback
  desktopTransition: function () {
    this.goToOrder();
  }
});
