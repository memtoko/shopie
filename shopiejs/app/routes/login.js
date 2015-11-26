import Ember from 'ember';
import StyleBody from '../mixins/style-body';
import Configuration from 'ember-simple-auth/configuration';
import DS from 'ember-data';

export default Ember.Route.extend(StyleBody, {
  titleToken: 'Sign In',
  classNames: ['shopie-login'],
  session: Ember.inject.service(),

  beforeModel() {
    if (this.get('session.isAuthenticated')) {
      this.transitionTo(Configuration.routeIfAlreadyAuthenticated);
    }
  },

  model() {
    return Ember.Object.create({
      identification: '',
      password: '',
      errors: DS.Errors.create()
    });
  },

  deactivate() {
    this._super(...arguments);
    let controller = this.controllerFor('login');

    controller.set('model.identification', '');
    controller.set('model.password', '');
  }
});
