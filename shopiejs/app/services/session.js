import Ember from 'ember';
import SessionService from 'ember-simple-auth/services/session';
import getCookie from 'shopie/utils/get-cookie';

const { computed } = Ember;

export default SessionService.extend({
  store: Ember.inject.service(),

  user: computed(function () {
    return this.get('store').findRecord('user', 'me');
  }),

  csrfToken: computed(function() {
    return getCookie('csrftoken');
  }).volatile()
});
