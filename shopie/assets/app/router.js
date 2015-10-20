import Ember from 'ember';
import config from './config/environment';
import documentTitle from 'shopie/utils/document-title';
/* global $ */
$('noscript').remove();

var Router = Ember.Router.extend({
  location: config.locationType
});

documentTitle();

Router.map(function() {
  this.route('cart');
  //product
  this.route('shop');
  this.route('product', {path: '/product/:product_slug'});
  this.route('issues', {path: '/product/:product_slug/issues'});
  this.route('users', { path: '/user'});
  this.route('login', { path: '/login'});
});

export default Router;
