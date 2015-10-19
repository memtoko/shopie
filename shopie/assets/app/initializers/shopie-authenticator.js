import ShopieOauth2Authenticator from 'shopie/authenticators/shopie-oauth2';

export default {
    name: 'shopie-authenticator',

    initialize: function (registry, application) {
        application.register(
            'shopie-authenticator:oauth2-password-grant',
            ShopieOauth2Authenticator
        );
    }
};
