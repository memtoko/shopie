define('shopie/initializers/simple-auth-oauth2', ['exports', 'simple-auth-oauth2/configuration', 'simple-auth-oauth2/authenticators/oauth2', 'simple-auth-oauth2/authorizers/oauth2', 'shopie/config/environment'], function (exports, Configuration, Authenticator, Authorizer, ENV) {

  'use strict';

  exports['default'] = {
    name: 'simple-auth-oauth2',
    before: 'simple-auth',
    initialize: function initialize(container, application) {
      Configuration['default'].load(container, ENV['default']['simple-auth-oauth2'] || {});
      container.register('simple-auth-authorizer:oauth2-bearer', Authorizer['default']);
      container.register('simple-auth-authenticator:oauth2-password-grant', Authenticator['default']);
    }
  };

});