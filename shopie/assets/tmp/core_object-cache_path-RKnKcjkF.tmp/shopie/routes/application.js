define('shopie/routes/application', ['exports', 'ember', 'simple-auth/mixins/application-route-mixin', 'simple-auth/configuration', 'shopie/mixins/shortcuts-route', 'shopie/utils/ctrl-or-cmd'], function (exports, Ember, ApplicationRouteMixin, Configuration, ShortcutsRoute, ctrlOrCmd) {

    'use strict';

    var shortcuts = {};

    shortcuts.esc = { action: 'closeMenus', scope: 'all' };
    shortcuts.enter = { action: 'confirmModal', scope: 'modal' };
    shortcuts[ctrlOrCmd['default'] + '+s'] = { action: 'save', scope: 'all' };

    exports['default'] = Ember['default'].Route.extend(ApplicationRouteMixin['default'], ShortcutsRoute['default'], {
        shortcuts: shortcuts,
        config: Ember['default'].inject.service(),
        notifications: Ember['default'].inject.service(),

        title: function title(tokens) {
            return tokens.join(' - Shopie');
        },

        actions: {
            invalidateSession: function invalidateSession() {
                this.get('session').invalidate();
            },

            sessionAuthenticationFailed: function sessionAuthenticationFailed(error) {
                if (error.errors) {
                    // These are server side errors, which can be marked as htmlSafe
                    error.errors.forEach(function (err) {
                        err.message = err.message.htmlSafe();
                    });
                }
            },

            openModal: function openModal(modalName, model, type) {
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

            confirmModal: function confirmModal() {
                var modalName = this.get('modalName');

                this.send('closeModal');

                if (this.controllerFor(modalName, true)) {
                    this.controllerFor(modalName).send('confirmAccept');
                }
            },

            closeModal: function closeModal() {
                this.disconnectOutlet({
                    outlet: 'modal',
                    parentView: 'application'
                });

                key.setScope('default');
            },

            // noop default for unhandled save (used from shortcuts)
            save: Ember['default'].K
        }
    });

});