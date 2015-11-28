import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  users: Ember.computed.alias('model')
});
