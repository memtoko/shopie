import DS from 'ember-data';

export default DS.Model.extend({
    subtotalPrice: DS.attr('string'),
    totalPrice: DS.attr('string'),
    createdAt: DS.attr('moment-date'),
    updatedAt: DS.attr('moment-date'),
    extraPrice: DS.attr(),
    user: DS.belongsTo('user'),
    items: DS.hasMany('cart-item', { async: true })
});