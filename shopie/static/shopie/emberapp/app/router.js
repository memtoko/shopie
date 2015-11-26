import Ember from 'ember';
import config from './config/environment'
import shopiePaths from './utils/shopie-paths';

let isProduction = config.environment === 'production';

let Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: isProduction ? shopiePaths().adminRoot : '/',
});

Router.map(function() {
  this.route('login');
  this.route('logout');

  this.route('orders', {path: '/'}, function () {
    this.route('order', {path: ':order_id'});
  });
});

export default Router;
