import Ember from 'ember';
import ENV from '../config/environment';
import Authenticator from 'shopie/authenticators/shopie-token';
import Authorizer from 'shopie/authorizers/shopie-token';

export default {
    name: 'shopie-token-auth',
    before:      'simple-auth',
    initialize: function(container, application) {
        container.register('authorizer:shopie-token-auth', Authorizer);
        container.register('authenticator:shopie-token-auth', Authenticator);
        ENV['simple-auth'].localStorageKey = 'shopie:session';
    }
};
