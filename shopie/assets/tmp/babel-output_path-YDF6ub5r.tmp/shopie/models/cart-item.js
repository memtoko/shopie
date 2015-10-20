import DS from 'ember-data';

export default DS.Model.extend({
    quantity: DS.attr('integer'),
    lineTotal: DS.attr(),
    lineSubtotal: DS.attr(),
    extraPrice: DS.attr(),
    product: DS.belongsTo('product'),
    cart: DS.belongsTo('cart')
});