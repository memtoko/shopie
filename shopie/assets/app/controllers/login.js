import Ember from 'ember';
import ValidationEngine from 'shopie/mixins/validation-engine';
import {request as ajax} from 'ic-ajax';
/* global $ */
export default Ember.Controller.extend(ValidationEngine, {
    submitting: false,
    loggingIn: false,
    authProperties: ['identification', 'password'],

    session: Ember.inject.service(),
    shopiePaths: Ember.inject.service('shopie-paths'),
    notifications: Ember.inject.service(),
    flowErrors: '',

    validationType: 'login',

    actions: {
        authenticate: function() {
            let model = this.get('model'),
                data = model.getProperties(this.authProperties);

            const authStrategy = 'authenticator:oauth2';

            this.get('session').authenticate(authStrategy, model.get('identification'), model.get('password')).catch((err) => {
                this.toggleProperty('loggingIn');
                if (err.error) {
                    this.set('flowErrors', `${err.error}: ${err.error_description}`);
                }
            });
        },

        validateAndAuthenticate: function() {
            this.set('flowErrors', '');
            // Manually trigger events for input fields, ensuring legacy compatibility with
            // browsers and password managers that don't send proper events on autofill
            $('#login').find('input').trigger('change');

            // This is a bit dirty, but there's no other way to ensure the properties are set as well as 'signin'
            this.get('hasValidated').addObjects(this.authProperties);

            this.validate({property: 'login'}).then(() => {
                this.toggleProperty('loggingIn');
                this.send('authenticate');
            }).catch((error) => {
                if (error) {
                    this.get('notifications').showAPIError(error, {key: 'login.authenticate'});
                } else {
                    this.set('flowErrors', 'Please fill out the form to sign in.');
                }
            });
        },

        forgotten: function() {
            let email = this.get('model.identification'),
                notifications = this.get('notifications');

            this.set('flowErrors', '');
            this.get('hasValidated').addObject('identification');

            //to do build api for this
            return new Ember.RSVP.Promise((resolve, reject) => reject());
        }
    }
});
