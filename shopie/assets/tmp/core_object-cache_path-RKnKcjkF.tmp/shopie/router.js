define('shopie/router', ['exports', 'ember', 'shopie/config/environment', 'shopie/utils/document-title'], function (exports, Ember, config, documentTitle) {

  'use strict';

  $('noscript').remove();

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  documentTitle['default']();

  Router.map(function () {
    this.route('cart');
    //product
    this.route('shop');
    this.route('product', { path: '/product/:product_slug' });
    this.route('issues', { path: '/product/:product_slug/issues' });
    this.route('users', { path: '/user' });
    this.route('login', {});
  });

  exports['default'] = Router;

});