define('shopie/initializers/simple-auth-env', ['exports', 'shopie/config/environment'], function (exports, ENV) {

    'use strict';

    exports['default'] = {
        name: 'simple-auth-env',
        before: 'simple-auth-oauth2',

        initialize: function initialize() {
            ENV['default']['simple-auth-oauth2'].serverTokenEndpoint = '/o/token/';
            ENV['default']['simple-auth-oauth2'].serverTokenRevocationEndpoint = '/authentication/revoke_token/';

            ENV['default']['simple-auth'].localStorageKey = 'shopie:session';
        }
    };

});