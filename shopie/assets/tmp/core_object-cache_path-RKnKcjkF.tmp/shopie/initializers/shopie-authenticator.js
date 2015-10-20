define('shopie/initializers/shopie-authenticator', ['exports', 'shopie/authenticators/shopie-oauth2'], function (exports, ShopieOauth2Authenticator) {

    'use strict';

    exports['default'] = {
        name: 'shopie-authenticator',

        initialize: function initialize(registry, application) {
            application.register('shopie-authenticator:oauth2-password-grant', ShopieOauth2Authenticator['default']);
        }
    };

});