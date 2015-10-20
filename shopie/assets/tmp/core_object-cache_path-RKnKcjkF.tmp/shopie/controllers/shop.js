define('shopie/controllers/shop', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        showCart: false,
        actions: {
            openQuickView: function openQuickView(product) {
                this.send('openModal', 'quick-view', product);
            }
        }
    });

});