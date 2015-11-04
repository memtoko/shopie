import DS from 'ember-data';

export default DS.Model.extend({
    quantity: DS.attr(),
    lineTotal: DS.attr(),
    lineSubtotal: DS.attr(),
    unitPrice: DS.attr(),
    product: DS.belongsTo('product', {async: true}),
    order: DS.belongsTo('order', {async: true}),

    productName: function() {
        return this.get('product.name');
    }.property('product.name'),

    productPrice: function() {
        return this.get('product.unitPrice');
    }.property('product.unitPrice'),

    productId: function() {
        return this.get('product.id');
    }.property('product.id'),

    subTotal: Ember.computed('productPrice', 'quantity', function() {
        let price = parseInt(this.get('productPrice')),
            quantity = parseInt(this.get('quantity'));
        return price * quantity;
    }),

    total: function() {
        return this.get('itemLineSubTotal');
    }.property('itemLineSubTotal')
});
