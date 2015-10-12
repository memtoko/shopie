import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import Configuration from 'simple-auth/configuration';
import ShortcutsRoute from 'shopie/mixins/shortcuts-route';
import ctrlOrCmd from 'shopie/utils/ctrl-or-cmd';

var shortcuts = {};

shortcuts.esc = {action: 'closeMenus', scope: 'all'};
shortcuts.enter = {action: 'confirmModal', scope: 'modal'};
shortcuts[ctrlOrCmd + '+s'] = {action: 'save', scope: 'all'};

export default Ember.Route.extend(ApplicationRouteMixin, ShortcutsRoute, {
    shortcuts: shortcuts,
    config: Ember.inject.service(),

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

        // noop default for unhandled save (used from shortcuts)
        save: Ember.K
    }
});
