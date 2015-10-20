define('shopie/routes/login', ['exports', 'ember', 'simple-auth/configuration', 'shopie/mixins/style-body', 'ember-data'], function (exports, Ember, Configuration, styleBody, DS) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend(styleBody['default'], {
        titleToken: 'Log In',

        classNames: ['shopie-login'],

        beforeModel: function beforeModel() {
            if (this.get('session').isAuthenticated) {
                this.transitionTo(Configuration['default'].routeAfterAuthentication);
            }
        },

        model: function model() {
            return Ember['default'].Object.create({
                identification: '',
                password: '',
                errors: DS['default'].Errors.create()
            });
        },

        // the deactivate hook is called after a route has been exited.
        deactivate: function deactivate() {
            this._super();

            var controller = this.controllerFor('login');

            // clear the properties that hold the credentials when we're no longer on the signin screen
            controller.set('model.identification', '');
            controller.set('model.password', '');
        }
    });

});