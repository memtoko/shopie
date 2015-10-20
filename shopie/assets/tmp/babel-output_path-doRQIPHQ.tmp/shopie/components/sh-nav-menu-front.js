import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'nav',
    classNames: ['sh-nav'],
    classNameBindings: ['open'],

    config: Ember.inject.service(),

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