define('shopie/components/sh-notifications', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'aside',
        classNames: 'sh-notifications',

        notifications: Ember['default'].inject.service(),

        messages: Ember['default'].computed.alias('notifications.notifications')
    });

});