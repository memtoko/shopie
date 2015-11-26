import Ember from 'ember';

import computed, {propertyNotEqual} from '../utils/computed';

export default Ember.Controller.extend({
  dropdown: Ember.inject.service(),
  signedOut: Ember.computed.match('currentPath', /(login|logout|setup|reset)/),

  topNotificationCount: 0,
  showMobileMenu: false,
  showSettingsMenu: false,

  autoNav: false,
  autoNavOpen: computed('autoNav', {
    get() {
      return false;
    },

    set(key, value) {
      if (this.get('autoNav')) {
        return value;
      }
      return false;
    }
  }),

  actions: {

    topNotificationChange(count) {
      this.set('topNotificationCount', count);
    },

    toggleAutoNav() {
      this.toggleProperty('autoNav');
    },

    openAutoNav() {
      this.set('autoNavOpen', true);
    },

    closeAutoNav() {
      this.set('autoNavOpen', false);
    },

    closeMobileMenu() {
      this.set('showMobileMenu', false);
    }
  }
});
