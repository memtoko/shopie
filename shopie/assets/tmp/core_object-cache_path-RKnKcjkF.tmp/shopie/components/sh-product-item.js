define('shopie/components/sh-product-item', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'li',
        classNames: ['sh-product', 'product', 'js-product'],

        actions: {
            view: function view(product) {
                this.sendAction('view', product);
            }
        }
    });

});