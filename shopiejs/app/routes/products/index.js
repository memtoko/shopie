import AuthenticatedRouteMixin from '../../mixins/authenticated-staff';
import MobileRoute from '../mobile-route';
import mobileQuery from '../../libs/mobile-query';

export default MobileRoute.extend(AuthenticatedRouteMixin, {
  noOrders: false,

  // Transition to a specific post if we're not on mobile
  beforeModel() {
    if (!mobileQuery.matches) {
      return this.goToProduct();
    }
  },

  setupController(controller, model) {
    /*jshint unused:false*/
    controller.set('noProducts', this.get('noProducts'));
  },

  goToProduct() {
    // the store has been populated by PostsRoute
    var products = this.store.peekAll('product'),
      product;

    product = products.find(function (product) {
      return product && product.get('parent.content') == null;
    });

    if (product) {
      return this.transitionTo('products.product', product);
    }

    this.set('noProducts', true);

  },

  // Mobile posts route callback
  desktopTransition: function () {
    this.goToProduct();
  }
});
