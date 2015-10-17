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
  this.route('users', { path: '/user'});
  this.route('login', {});
});

export default Router;
