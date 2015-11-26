import Ember from 'ember';

let { merge } = Ember;

export default {
  name: 'oauth-prefilter',
  after: 'ember-simple-auth',

  initialize(application) {
    let session = application.container.lookup('service:session');
    Ember.$.ajaxPrefilter(function(options) {
      session.authorize('authorizer:oauth2', function(headerName, headerValue) {
        let headerObject = {};

        headerObject[headerName] = headerValue;
        options.headers = merge(options.headers || {}, headerObject);
      });
    })
  }
};
