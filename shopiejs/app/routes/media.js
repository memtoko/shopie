import Ember from 'ember';
import AuthenticatedRouteStaff from './shopie-authenticated-staff';
import PaginationRouteMixin from '../mixins/pagination-route';
import ShortcutsRoute from '../mixins/shortcuts-route';

export default AuthenticatedRouteStaff.extend(ShortcutsRoute, PaginationRouteMixin, {
  titleToken: 'Media',
  paginationModel: 'medium',

  model() {
    return this.loadFirstPage().then(() => {
      return this.store.filter('medium', (medium) => {
        return true; //no op for now
      });
    });
  },

  shortcuts: {
    'up, k': 'moveUp',
    'down, j': 'moveDown',
    left: 'focusList',
    right: 'focusContent'
  },

  deactivate() {
    this.send('resetPagination');
  },

  stepThroughMedia(step) {
    var currentMedium = this.modelFor('media.medium'),
      media = this.get('controller.media'),
      length = media.get('length');

    if (currentMedium && length) {
      let newPosition = media.indexOf(currentMedium) + step;

      if (newPosition >= length) {
          return;
      } else if (newPosition < 0) {
          return;
      }

      this.transitionTo('media.medium', media.objectAt(newPosition));
    }
  },

  scrollContent(amount) {
    let content = Ember.$('.media-menu-pane'),
      scrolled = content.scrollTop();
    content.scrollTop(scrolled + 50 * amount);
  },

  actions: {
    moveUp() {
      if (this.controller.get('mediaContentFocused')) {
        this.scrollContent(-1);
      } else {
        this.stepThroughMedia(-1);
      }
    },

    moveDown() {
      if (this.controller.get('mediaContentFocused')) {
        this.scrollContent(1);
      } else {
        this.stepThroughMedia(1);
      }
    },

    focusList() {
      this.set('controller.keyboardFocus', 'mediaList');
    },

    focusContent() {
      this.set('controller.keyboardFocus', 'mediaContent');
    },
  }
});
