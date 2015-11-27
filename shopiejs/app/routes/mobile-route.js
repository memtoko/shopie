import Ember from 'ember';
import mobileQuery from '../libs/mobile-query';

export default Ember.Route.extend({
  desktopTransition: Ember.K,

  activate() {
    this._super();
    mobileQuery.addListener(this.desktopTransitionMQ);
  },

  deactivate() {
    this._super();
    mobileQuery.removeListener(this.desktopTransitionMQ);
  },

  setDesktopTransitionMQ: Ember.on('init', function () {
    var self = this;
    this.set('desktopTransitionMQ', function desktopTransitionMQ() {
      if (!mobileQuery.matches) {
        self.desktopTransition();
      }
    });
  })
});
