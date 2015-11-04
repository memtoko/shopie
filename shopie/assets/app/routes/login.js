import Ember from 'ember';
import Configuration from 'ember-simple-auth/configuration';
import styleBody from 'shopie/mixins/style-body';
import DS from 'ember-data';

export default Ember.Route.extend(styleBody, {
    titleToken: 'Log In',

    classNames: ['shopie-login'],
    session: Ember.inject.service(),

    beforeModel: function () {
        if (this.get('session.isAuthenticated')) {
            this.transitionTo(Configuration.routeIfAlreadyAuthenticated);
        }
    },

    model: function () {
        return Ember.Object.create({
            identification: '',
            password: '',
            errors: DS.Errors.create()
        });
    },

    // the deactivate hook is called after a route has been exited.
    deactivate: function () {
        this._super();

        var controller = this.controllerFor('login');

        // clear the properties that hold the credentials when we're no longer on the signin screen
        controller.set('model.identification', '');
        controller.set('model.password', '');
    }
});
