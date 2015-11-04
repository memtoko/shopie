import Ember from 'ember';
import Authenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default Authenticator.extend({
    config: Ember.inject.service(),

    shopiePaths: Ember.inject.service('shopie-paths'),

    serverTokenEndpoint: Ember.computed('shopiePaths.oauth2Root', function () {
        return this.get('shopiePaths.oauth2Root') + '/token/';
    }),

    serverTokenRevocationEndpoint: Ember.computed('shopiePaths.oauth2Root', function () {
        return this.get('shopiePaths.oauth2Root') + '/revoke_token/';
    }),

    makeRequest: function (url, data) {
        data.client_id = this.get('config.clientId');
        data.client_secret = this.get('config.clientSecret');
        data.scopes = ['read', 'write'];
        return this._super(url, data);
    }
});
