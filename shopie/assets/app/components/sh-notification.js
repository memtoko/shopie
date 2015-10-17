import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'article',
    classNames: ['sh-notification', 'sh-notification-passive'],
    classNameBindings: ['typeClass'],

    message: null,

    notifications: Ember.inject.service(),

    typeClass: Ember.computed('message.type', function () {
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

    didInsertElement: function () {
        this.$().on('animationend webkitAnimationEnd oanimationend MSAnimationEnd', (event) => {
            if (event.originalEvent.animationName === 'fade-out') {
                this.get('notifications').closeNotification(this.get('message'));
            }
        });
    },

    willDestroyElement: function () {
        this.$().off('animationend webkitAnimationEnd oanimationend MSAnimationEnd');
    },

    actions: {
        closeNotification: function () {
            this.get('notifications').closeNotification(this.get('message'));
        }
    }
});
