define('shopie/components/sh-nav-menu-front', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        tagName: 'nav',
        classNames: ['sh-nav'],
        classNameBindings: ['open'],

        config: Ember['default'].inject.service(),

        open: false,

        mouseEnter: function mouseEnter() {
            this.sendAction('onMouseEnter');
        },

        actions: {
            toggleAutoNav: function toggleAutoNav() {
                this.sendAction('toggleMaximise');
            },

            openModal: function openModal(modal) {
                this.sendAction('openModal', modal);
            },

            closeMobileMenu: function closeMobileMenu() {
                this.sendAction('closeMobileMenu');
            },

            openAutoNav: function openAutoNav() {
                this.sendAction('openAutoNav');
            }
        }
    });

});