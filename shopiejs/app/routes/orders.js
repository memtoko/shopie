import Ember from 'ember';
import AuthenticatedRouteStaff from './shopie-authenticated-staff';
import ShortcutsRoute from '../mixins/shortcuts-route';
import PaginationRouteMixin from '../mixins/pagination-route';

export default AuthenticatedRouteStaff.extend(ShortcutsRoute, PaginationRouteMixin, {
  titleToken: 'Orders',
  paginationModel: 'order',

  model() {
    return this.loadFirstPage().then((function (_this) {
      return function () {
        return _this.store.filter('order', function (order) {
          return true;
        });
      };
    })(this));
  },

  stepThroughOrders(step) {
    var currentOrder = this.get('controller.currentOrder'),
      orders = this.get('controller.sortedOrders'),
      length = orders.get('length'),
      newPosition;

    newPosition = orders.indexOf(currentOrder) + step;

    if (newPosition >= length || newPosition < 0) {
      return;
    }

    this.transitionTo('orders.order', orders.objectAt(newPosition));
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
      this.controller.set('keyboardFocus', 'orderList');
    },

    focusContent() {
      this.controller.set('keyboardFocus', 'orderContent');
    },

    moveUp() {
      if (this.controller.get('orderContentFocused')) {
        this.scrollContent(-1);
      } else {
        this.stepThroughPosts(-1);
      }
    },

    moveDown() {
      if (this.controller.get('orderContentFocused')) {
        this.scrollContent(1);
      } else {
        this.stepThroughPosts(1);
      }
    }
  }
});
