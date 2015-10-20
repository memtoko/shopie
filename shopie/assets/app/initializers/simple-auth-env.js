import ENV from '../config/environment';

export default {
    name: 'simple-auth-env',
    before: 'simple-auth-oauth2',

    initialize: function () {
        ENV['simple-auth-oauth2'].serverTokenEndpoint = '/o/token/';
        ENV['simple-auth-oauth2'].serverTokenRevocationEndpoint = '/o/revoke_token/';

        ENV['simple-auth'].localStorageKey = 'shopie:session';
    }
};
