import Ember from 'ember';

export default Ember.Component.extend({
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