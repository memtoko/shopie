define('shopie/authenticators/shopie-oauth2', ['exports', 'ember', 'simple-auth-oauth2/authenticators/oauth2'], function (exports, Ember, Authenticator) {

    'use strict';

    exports['default'] = Authenticator['default'].extend({
        config: Ember['default'].inject.service(),
        makeRequest: function makeRequest(url, data) {
            data.client_id = this.get('config.clientId');
            data.client_secret = this.get('config.clientSecret');
            data.scopes = 'read write';
            return this._super(url, data);
        }
    });

});