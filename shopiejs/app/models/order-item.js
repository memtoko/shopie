import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  quantity: DS.attr(),
  lineTotal: DS.attr(),
  lineSubtotal: DS.attr(),
  unitPrice: DS.attr(),
  product: DS.belongsTo('product', {
    async: true
  }),
  order: DS.belongsTo('order', {
    async: true
  }),
  productName: Ember.computed('product.name', function () {
    return this.get('product.name');
  }),
  productPrice: Ember.computed('product.unitPrice', function () {
    return this.get('product.unitPrice');
  }),
  productId: Ember.computed('product.id', function () {
    return this.get('product.id');
  })
});
