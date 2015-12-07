import Ember from 'ember';

let { computed } = Ember;

export default Ember.Controller.extend({

  productListFocused: computed.equal('keyboardFocus', 'productList'),
  productContentFocused: computed.equal('keyboardFocus', 'productContent'),

  products: computed.sort('model', function (a, b) {
    var idA = +a.get('id'),
      idB = +b.get('id');

    if (idA > idB) {
      return 1;
    } else if (idA < idB) {
      return -1;
    }

    return 0;
  }),

  actions: {

    showProductContent(product) {
      if (!product) {
        return;
      }
      this.transitionToRoute('products.product', product);
    }
  }
});
