import Ember from 'ember';
import ENV from '../config/environment';
import Authenticator from 'shopie/authenticators/shopie-token-auth';
import Authorizer from 'shopie/authorizers/shopie-token-auth';

export default {
    name: 'shopie-token-auth',
    before: 'simple-auth',
    initialize: function initialize(container, application) {
        container.register('simple-auth-authorizer:shopie-token-auth', Authorizer);
        container.register('simple-auth-authenticator:shopie-token-auth', Authenticator);
        ENV['simple-auth'].localStorageKey = 'shopie:session';
    }
};