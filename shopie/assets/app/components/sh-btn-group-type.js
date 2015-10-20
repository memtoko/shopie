import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'section',
    classNames: ['sh-btn-group-type'],

    actions: {
        primaryAction: function() {
            this.sendAction('primaryAction');
        },
        secondaryAction: function() {
            this.sendAction('secondaryAction');
        }
    }
});
