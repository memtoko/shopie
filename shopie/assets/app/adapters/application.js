import Ember from 'ember';
import DjangoTastypieAdapter from './tastypie';
import ENV from '../config/environment';

export default DjangoTastypieAdapter.extend({
  serverDomain: Ember.computed(function() {
    return ENV.APP.API_HOST;
  }),

  namespace: Ember.computed(function() {
    return ENV.APP.API_NAMESPACE;
  })
});
