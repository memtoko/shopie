define('shopie/models/cart-item', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        quantity: DS['default'].attr(),
        lineTotal: DS['default'].attr(),
        lineSubtotal: DS['default'].attr(),
        extraPrice: DS['default'].attr(),
        product: DS['default'].belongsTo('product', { async: true }),
        cart: DS['default'].belongsTo('cart'),

        productName: (function () {
            return this.get('product.name');
        }).property('product.name'),

        productPrice: (function () {
            return this.get('product').get('unitPrice');
        }).property('product.name'),

        productId: (function () {
            return this.get('product.id');
        }).property('product.id')
    });

});