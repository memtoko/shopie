define('shopie/components/sh-notification', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'article',
        classNames: ['sh-notification', 'sh-notification-passive'],
        classNameBindings: ['typeClass'],

        message: null,

        notifications: Ember['default'].inject.service(),

        typeClass: Ember['default'].computed('message.type', function () {
            var classes = '',
                type = this.get('message.type'),
                typeMapping;

            typeMapping = {
                success: 'green',
                error: 'red',
                warn: 'yellow'
            };

            if (typeMapping[type] !== undefined) {
                classes += 'sh-notification-' + typeMapping[type];
            }

            return classes;
        }),

        didInsertElement: function didInsertElement() {
            var _this = this;

            this.$().on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function (event) {
                if (event.originalEvent.animationName === 'fade-out') {
                    _this.get('notifications').closeNotification(_this.get('message'));
                }
            });
        },

        willDestroyElement: function willDestroyElement() {
            this.$().off('animationend webkitAnimationEnd oanimationend MSAnimationEnd');
        },

        actions: {
            closeNotification: function closeNotification() {
                this.get('notifications').closeNotification(this.get('message'));
            }
        }
    });

});