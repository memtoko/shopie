define('shopie/components/sh-main', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'main',
        classNames: ['sh-main'],
        ariaRole: 'main',

        mouseEnter: function mouseEnter() {
            this.sendAction('onMouseEnter');
        }
    });

});