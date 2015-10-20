define('shopie/models/cart', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        subtotalPrice: DS['default'].attr('string'),
        totalPrice: DS['default'].attr('string'),
        createdAt: DS['default'].attr('moment-date'),
        updatedAt: DS['default'].attr('moment-date'),
        extraPrice: DS['default'].attr(),
        user: DS['default'].belongsTo('user'),
        items: DS['default'].hasMany('cart-item', { async: true })
    });

});