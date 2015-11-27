import Ember from 'ember';
import config from './config/environment'
import shopiePaths from './utils/shopie-paths';
import ensureSlash from './utils/ensure-slash';

let Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: ensureSlash(shopiePaths().adminRoot),
});

Router.map(function() {
  this.route('login');
  this.route('logout');

  this.route('orders', {path: '/'}, function () {
    this.route('order', {path: ':order_id'});
  });

  this.route('team', {path: '/team'}, function () {
    this.route('user', {path: ':user_id'});
  });
});

export default Router;
