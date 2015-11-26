import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import shopiePaths from '../utils/shopie-paths';
import ctrlOrCmd from 'shopie/utils/ctrl-or-cmd'
import ShortcutsRoute from 'shopie/mixins/shortcuts-route';

let { RSVP } = Ember;

let shortcuts = {
  esc: {
    action: 'closeMenus',
    scope: 'all'
  },

  enter: {
    action: 'confirmModal', scope: 'modal'
  }
};

shortcuts[ctrlOrCmd + '+s'] = {
  action: 'save', scope: 'all'
};

export default Ember.Route.extend(ApplicationRouteMixin, ShortcutsRoute, {
  shortcuts: shortcuts,
  config: Ember.inject.service(),
  notifications: Ember.inject.service(),

  title(tokens) {
    return tokens.join(' - ') + 'Shopie';
  },

  /**
  Make sure user logged in here is staff
  */
  sessionAuthenticated() {
    let appController = this.controllerFor('application');

    if (appController && appController.get('skipAuthSuccessHandler')) {
      return;
    }

    this._super(...arguments);
    this.get('session.user').then((user) => {
      this.send('signedIn', user);
    });
  },

  sessionInvalidated() {
    this.send('authorizationFailed');
  },

  actions: {

    openMobileMenu() {
      this.controller().set('showMobileMenu', true);
    },

    openSettingsMenu() {
      this.controller.set('showSettingsMenu', true);
    },

    invalidateSession() {
      this.get('session').invalidate().catch((error) => {
        this.get('notifications').showAlert(error.message, {
          type: 'error',
          key: 'session.invalidate.failed'
        });
      });
    },

    signedIn() {
      this.get('notifications').clearAll();
    },

    closeMenus() {
      this.get('dropdown').closeDropdowns();
      this.send('closeModal');
      this.controller.setProperties({
          showSettingsMenu: false,
          showMobileMenu: false
      });
    },

    sessionAuthenticationFailed(error) {
      if (error.errors) {
        error.errors.forEach((err) => {
          err.message = err.message.htmlSafe();
        });
      }
    },

    openModal(modalName, model, type) {
      key.setScope('modal');
      modalName = `modals/${modalName}`;
      this.set('modalName', modalName);

      if (this.controllerFor(modalName, true)) {
        this.controllerFor(modalName).set('model', model);
      }

      this.render(modalName, {
        into: 'application',
        outlet: 'modal'
      });
    },

    confirmModal() {
      let modalName = this.get('modalName');

      this.send('closeModal');

      if (this.controllerFor(modalName)) {
        this.controllerFor(modalName).send('confirmAccept');
      }
    },

    closeModal() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
      key.setScope('default');
    },

    authorizationFailed() {
      window.location.replace(Configuration.baseURL);
    },

    save: Ember.K
  }
});
