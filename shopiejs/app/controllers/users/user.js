import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  user: Ember.computed.alias('model')
});
