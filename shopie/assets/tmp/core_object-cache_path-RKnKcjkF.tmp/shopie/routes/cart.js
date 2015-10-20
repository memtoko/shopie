define('shopie/routes/cart', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({
        titleToken: 'Cart',
        classNames: ['cart', 'js-cart'],

        config: Ember['default'].inject.service(),

        model: function model() {
            var cartId = this.get('config.currentCart');
            return this.get('store').findRecord('cart', cartId).then(function (cart) {
                var items = cart.get('items');
                return cart;
            });
        },

        actions: {
            refreshCart: function refreshCart() {
                this.model();
            }
        }
    });

});