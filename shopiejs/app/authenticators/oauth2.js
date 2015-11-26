import Ember from 'ember';
import Authenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';

const { service } = Ember.inject;
const { computed } = Ember;

export default Authenticator.extend({
  config: service('config'),
  shopiePaths: service('shopie-paths'),

  serverTokenEndpoint: computed('shopiePaths.oauth2Root', function () {
    return this.get('shopiePaths.oauth2Root') + '/token/';
  }),

  serverTokenRevocationEndpoint: computed('shopiePaths.oauth2Root', function () {
    return this.get('shopiePaths.oauth2Root') + '/revoke_token/';
  }),

  makeRequest(url, data) {
    data.client_id = this.get('config.clientId');
    data.client_secret = this.get('config.clientSecret');
    data.scopes = ['read', 'write'];

    return this._super(url, data);
  }
});
