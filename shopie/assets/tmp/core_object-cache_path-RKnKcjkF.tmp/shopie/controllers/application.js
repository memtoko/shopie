define('shopie/controllers/application', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({

        // jscs: disable
        signedOut: Ember['default'].computed.match('currentPath', /(signin|signup|setup|reset)/),
        // jscs: enable
        showCart: false,

        topNotificationCount: 0,
        showMobileMenu: false,
        showSettingsMenu: false,

        autoNav: false,
        autoNavOpen: Ember['default'].computed('autoNav', {
            get: function get() {
                return false;
            },
            set: function set(key, value) {
                if (this.get('autoNav')) {
                    return value;
                }
                return false;
            }
        }),

        actions: {
            topNotificationChange: function topNotificationChange(count) {
                this.set('topNotificationCount', count);
            },

            toggleAutoNav: function toggleAutoNav() {
                this.toggleProperty('autoNav');
            },

            openAutoNav: function openAutoNav() {
                this.set('autoNavOpen', true);
            },

            closeAutoNav: function closeAutoNav() {
                this.set('autoNavOpen', false);
            },

            closeMobileMenu: function closeMobileMenu() {
                this.set('showMobileMenu', false);
            }
        }
    });

});