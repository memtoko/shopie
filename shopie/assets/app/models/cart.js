import DS from 'ember-data';

export default DS.Model.extend({
    quantity: DS.attr('integer'),
    subtotalPrice: DS.attr('string'),
    totalPrice: DS.attr('string'),
    extraPrice: DS.attr(),
    user: DS.belongsTo('user')
});
