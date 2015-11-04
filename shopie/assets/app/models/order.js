import DS from 'ember-data';

export default DS.Model.extend({
    status: DS.attr('order-state'),
    fullName: DS.attr('string'),
    email: DS.attr('string'),
    orderKey: DS.attr('string'),
    orderTotal: DS.attr(),
    orderSubTotal: DS.attr(),
    createdAt: DS.attr('moment-date'),
    updatedAt: DS.attr('moment-date'),
    receivedAt: DS.attr('moment-date'),
    rejectedAt: DS.attr('moment-date'),
    user: DS.belongsTo('user'),
    items: DS.hasMany('order-item', {async: true}),

    total: Ember.computed('items.@each.total', function() {
        let totals = this.get('items').mapBy('total'),
            calculated = 0;
        for (tot of totals) {
            calculated += tot;
        }
        return calculated;
    })
});
