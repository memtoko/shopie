define('shopie/services/notifications', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Service.extend({
        delayedNotifications: Ember['default'].A(),
        content: Ember['default'].A(),

        alerts: Ember['default'].computed.filter('content', function (notification) {
            var status = Ember['default'].get(notification, 'status');
            return status === 'alert';
        }),

        notifications: Ember['default'].computed.filter('content', function (notification) {
            var status = Ember['default'].get(notification, 'status');
            return status === 'notification';
        }),

        handleNotification: function handleNotification(message, delayed) {
            // If this is an alert message from the server, treat it as html safe
            if (typeof message.toJSON === 'function' && message.get('status') === 'alert') {
                message.set('message', message.get('message').htmlSafe());
            }

            if (!Ember['default'].get(message, 'status')) {
                Ember['default'].set(message, 'status', 'notification');
            }

            if (!delayed) {
                this.get('content').pushObject(message);
            } else {
                this.get('delayedNotifications').pushObject(message);
            }
        },

        showAlert: function showAlert(message, options) {
            options = options || {};

            this.handleNotification({
                message: message,
                status: 'alert',
                type: options.type
            }, options.delayed);
        },

        showNotification: function showNotification(message, options) {
            options = options || {};

            if (!options.doNotCloseNotifications) {
                this.closeNotifications();
            }

            this.handleNotification({
                message: message,
                status: 'notification',
                type: options.type
            }, options.delayed);
        },

        // TODO: review whether this can be removed once no longer used by validations
        showErrors: function showErrors(errors, options) {
            options = options || {};

            if (!options.doNotCloseNotifications) {
                this.closeNotifications();
            }

            for (var i = 0; i < errors.length; i += 1) {
                this.showNotification(errors[i].message || errors[i], { type: 'error', doNotCloseNotifications: true });
            }
        },

        showAPIError: function showAPIError(resp, options) {
            options = options || {};
            options.type = options.type || 'error';

            if (!options.doNotCloseNotifications) {
                this.closeNotifications();
            }

            options.defaultErrorText = options.defaultErrorText || 'There was a problem on the server, please try again.';

            if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.error) {
                this.showAlert(resp.jqXHR.responseJSON.error, options);
            } else if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.errors) {
                this.showErrors(resp.jqXHR.responseJSON.errors, options);
            } else if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.message) {
                this.showAlert(resp.jqXHR.responseJSON.message, options);
            } else {
                this.showAlert(options.defaultErrorText, { type: options.type, doNotCloseNotifications: true });
            }
        },

        displayDelayed: function displayDelayed() {
            var self = this;

            self.delayedNotifications.forEach(function (message) {
                self.get('content').pushObject(message);
            });
            self.delayedNotifications = [];
        },

        closeNotification: function closeNotification(notification) {
            var content = this.get('content');

            if (typeof notification.toJSON === 'function') {
                notification.deleteRecord();
                notification.save()['finally'](function () {
                    content.removeObject(notification);
                });
            } else {
                content.removeObject(notification);
            }
        },

        closeNotifications: function closeNotifications() {
            this.set('content', this.get('content').rejectBy('status', 'notification'));
        },

        closeAll: function closeAll() {
            this.get('content').clear();
        }
    });

});