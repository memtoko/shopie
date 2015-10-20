define('shopie/components/sh-app', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        classNames: ['sh-app'],
        showCart: false,

        /**
        * todo: build logic to display cart
        * @type {Array}
        */
        showCartContent: Ember['default'].observer('showCart', function () {
            var showSettingsMenu = this.get('showCart');
        })
    });

});