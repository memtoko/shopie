import DS from 'ember-data';

export default DS.Model.extend({
    quantity: DS.attr(),
    lineTotal: DS.attr(),
    lineSubtotal: DS.attr(),
    extraPrice: DS.attr(),
    product: DS.belongsTo('product', { async: true }),
    cart: DS.belongsTo('cart'),

    productName: (function () {
        return this.get('product.name');
    }).property('product.name'),

    productPrice: (function () {
        return this.get('product').get('unitPrice');
    }).property('product.name'),

    productId: (function () {
        return this.get('product.id');
    }).property('product.id')
});