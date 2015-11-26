import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['sh-nav'],
  classNameBindings: ['open'],

  config: Ember.inject.service(),
  session: Ember.inject.service(),
  open: false,

  mouseEnter() {
    this.sendAction('onMouseEnter');
  },

  actions: {
    toggleAutoNav() {
      this.sendAction('toggleMaximise');
    },

    openModal(modal) {
      this.sendAction('openModal', modal);
    },

    closeMobileMenu() {
      this.sendAction('closeMobileMenu');
    },

    openAutoNav() {
      this.sendAction('openAutoNav');
    }
  }
});
