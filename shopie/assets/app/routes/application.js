import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import Configuration from 'simple-auth/configuration';
import ShortcutsRoute from 'shopie/mixins/shortcuts-route';
import ctrlOrCmd from 'shopie/utils/ctrl-or-cmd';

/* global key */

var shortcuts = {};

shortcuts.esc = {action: 'closeMenus', scope: 'all'};
shortcuts.enter = {action: 'confirmModal', scope: 'modal'};
shortcuts[ctrlOrCmd + '+s'] = {action: 'save', scope: 'all'};

export default Ember.Route.extend(ApplicationRouteMixin, ShortcutsRoute, {
    shortcuts: shortcuts,
    config: Ember.inject.service(),
    notifications: Ember.inject.service(),

    title: function (tokens) {
        return tokens.join(' - Shopie');
    },

    actions: {
        invalidateSession: function () {
            this.get('session').invalidate();
        },

        sessionAuthenticationFailed: function (error) {
            if (error.errors) {
                // These are server side errors, which can be marked as htmlSafe
                error.errors.forEach(function (err) {
                    err.message = err.message.htmlSafe();
                });
            }
        },

        openModal: function (modalName, model, type) {
            key.setScope('modal');
            modalName = 'modals/' + modalName;
            this.set('modalName', modalName);

            // We don't always require a modal to have a controller
            // so we're skipping asserting if one exists
            if (this.controllerFor(modalName, true)) {
                this.controllerFor(modalName).set('model', model);

                if (type) {
                    this.controllerFor(modalName).set('imageType', type);
                    this.controllerFor(modalName).set('src', model.get(type));
                }
            }

            return this.render(modalName, {
                into: 'application',
                outlet: 'modal'
            });
        },

        confirmModal: function () {
            var modalName = this.get('modalName');

            this.send('closeModal');

            if (this.controllerFor(modalName, true)) {
                this.controllerFor(modalName).send('confirmAccept');
            }
        },

        closeModal: function () {
            this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'application'
            });

            key.setScope('default');
        },

        // noop default for unhandled save (used from shortcuts)
        save: Ember.K
    }
});
