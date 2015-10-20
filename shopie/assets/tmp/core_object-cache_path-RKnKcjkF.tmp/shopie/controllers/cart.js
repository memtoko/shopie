define('shopie/controllers/cart', ['exports', 'ember', 'shopie/models/cart'], function (exports, Ember, CartModel) {

    'use strict';

    var watchedProps = ['models.items.[]'];
    CartModel['default'].eachAttribute(function (name) {
        watchedProps.push('model.' + name);
    });
    exports['default'] = Ember['default'].Controller.extend({
        items: (function () {
            return this.get('model.items');
        }).property('model.items')
    });

});