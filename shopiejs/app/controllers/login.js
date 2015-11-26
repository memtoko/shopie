import Ember from 'ember';
import ValidationEngine from '../mixins/validation-engine';

export default Ember.Controller.extend(ValidationEngine, {
  submitting: false,
  loggingIn: false,
  authProperties: ['identification', 'password'],
  shopiePaths: Ember.inject.service('shopie-paths'),
  notifications: Ember.inject.service(),
  session: Ember.inject.service(),
  application: Ember.inject.controller(),

  flowErrors: '',
  validationType: 'login',

  actions: {
    authenticate() {
      var model = this.get('model'),
        authStrategy = 'authenticator:oauth2';

      this.get('session').authenticate(
        authStrategy, model.get('identification'), model.get('password')
      ).catch((error) => {
        this.toggleProperty('loggingIn');
        if (error.error) {
          this.get('notifications').showAlert(`${error.error}: ${error.error_description}`, {
            type: 'error', key: 'session.authenticate.failed'
          });
        } else {
          this.get('notifications').showAlert('There was a problem on the server.', {
            type: 'error',
            key: 'session.authenticate.failed'
          });
        }
      });
    },

    validateAndAuthenticate() {
      this.set('flowErrors', '');
      // Manually trigger events for input fields, ensuring legacy compatibility with
      // browsers and password managers that don't send proper events on autofill
      $('#login').find('input').trigger('change');

      this.get('hasValidated').addObjects(this.authProperties);
      this.validate({property: 'login'}).then(() => {
        this.toggleProperty('loggingIn');
        this.send('authenticate');
      }).catch((error) => {
        if (error) {
          this.get('notifications').showAlert(error, {
            key: 'login.authenticate'
          });
        } else {
          this.set('flowErrors', 'Please fill out the form to sign in.');
        }
      });
    },

    forgotten() {
      var email = this.get('model.identification'),
        notifications = this.get('notifications');

      this.set('flowErrors', '');
      this.get('hasValidated').addObject('identification');

      this.validate({property: 'forgotPassword'}).then(() => {
        this.toggleProperty('submitting');

        this.get('ajax').post(this.get('shopiePaths.url').api('users', 'passwordreset'), {
          data: {
            passwordreset: email
          }
        }).then(() => {
          this.toggleProperty('submitting');
          notifications.showAlert('Please check your email for instructions.', {
            type: 'info', key: 'forgot-password.send.success'
          });
        }).catch((err) => {
          this.toggleProperty('submitting');
          notifications.showAlert('There was a problem on the server. maybe try again?', {
            type: 'info', key: 'forgot-password.send.error'
          });
        });
      }).catch(() => {
        this.set('flowErrors', 'We need your email address to reset your password!');
      });
    }
  }
});
