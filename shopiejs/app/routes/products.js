import Ember from 'ember';
import AuthenticatedRouteStaff from './shopie-authenticated-staff';
import ShortcutsRoute from '../mixins/shortcuts-route';
import PaginationRouteMixin from '../mixins/pagination-route';

export default AuthenticatedRouteStaff.extend(PaginationRouteMixin, ShortcutsRoute, {
  titleToken: 'Products',
  paginationModel: 'product',

  model() {
    return this.loadFirstPage().then(() => {
      return this.store.filter('product', (product) => {
        // store filter also work on promise
        return product.get('parent').then((parent) => {
          return parent == null;
        })
      });
    });
  },

  stepThroughProduct(step) {
    var currentProduct = this.get('controller.currentProduct'),
      products = this.get('controller.products'),
      length = products.get('length'),
      newPosition;

    newPosition = products.indexOf(currentProduct) + step;
    if (newPosition >= length || newPosition < 0) {
      return;
    }

    this.transitionTo('products.product', products.objectAt(newPosition));
  },

  scrollContent(amount) {
    var content = Ember.$('.js-content-preview'),
      scrolled = content.scrollTop();

    content.scrollTop(scrolled + 50 * amount);
  },

  shortcuts: {
    'up, k': 'moveUp',
    'down, j': 'moveDown',
    left: 'focusList',
    right: 'focusContent',
    //n: 'newPost'
  },

  actions: {

    focusList() {
      this.controller.set('keyboardFocus', 'productList');
    },

    focusContent() {
      this.controller.set('keyboardFocus', 'productContent');
    },

    moveUp() {
      if (this.controller.get('productContentFocused')) {
        this.scrollContent(-1);
      } else {
        this.stepThroughPosts(-1);
      }
    },

    moveDown() {
      if (this.controller.get('productContentFocused')) {
        this.scrollContent(1);
      } else {
        this.stepThroughPosts(1);
      }
    }
  }
});
