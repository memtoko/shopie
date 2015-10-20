define('shopie/components/sh-btn-group-type', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'section',
        classNames: ['sh-btn-group-type'],

        actions: {
            primaryAction: function primaryAction() {
                this.sendAction('primaryAction');
            },
            secondaryAction: function secondaryAction() {
                this.sendAction('secondaryAction');
            }
        }
    });

});