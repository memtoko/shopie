import AuthenticatedRouteStaff from '../shopie-authenticated-staff';
import ShortcutsRoute from '../../mixins/shortcuts-route';
import isNumber, { isFinite } from '../../utils/number-type';

export default AuthenticatedRouteStaff.extend(ShortcutsRoute, {

  model(params) {
    var productId,
      product,
      query;

    productId = Number(params.product_id);

    if (!isNumber(productId) || !isFinite(productId) || productId % 1 !== 0 || productId <= 0) {
      return this.transitionTo('error404', params.product_id);
    }

    product = this.store.peekRecord('product', productId);
    if (product) {
      return product.get('parent').then((parent) => {
        if (parent == null) {
          return product;
        } else {
          return this.replaceRoute('products.index');
        }
      });
    }

    query = {
      id: productId,
      status: 'all'
    };
    return this.store.query('product', query).then((product) => {
      if (product) {
        return product.get('parent').then((parent) => {
          if (parent == null) {
            return product;
          } else {
            return this.replaceRoute('products.index');
          }
        });
      }
      return this.replaceRoute('products.index');
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    Ember.run.scheduleOnce('afterRender', this, function () {
      this.controllerFor('products').set('currentProduct', model);
    });
  },

  shortcuts: {
    'enter, o': 'openEditor',
    'command+backspace, ctrl+backspace': 'deleteProduct'
  },

  actions: {
    openEditor(product) {

    },

    deleteProduct(product) {

    }
  }
});
