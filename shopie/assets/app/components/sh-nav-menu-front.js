import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'nav',
    classNames: ['sh-nav'],
    classNameBindings: ['open'],

    config: Ember.inject.service(),

    open: false,

    mouseEnter: function () {
        this.sendAction('onMouseEnter');
    },

    actions: {
        toggleAutoNav: function () {
            this.sendAction('toggleMaximise');
        },

        openModal: function (modal) {
            this.sendAction('openModal', modal);
        },

        closeMobileMenu: function () {
            this.sendAction('closeMobileMenu');
        },

        openAutoNav: function () {
            this.sendAction('openAutoNav');
        }
    }
});
