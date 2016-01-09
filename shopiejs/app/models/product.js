import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  slug: DS.attr('string'),
  shortDescription: DS.attr('string'),
  description: DS.attr('string'),
  image: DS.attr(),
  unitPrice: DS.attr('number'),
  isActive: DS.attr('boolean'),
  status: DS.attr(),

  createdAt: DS.attr('moment-date'),
  updatedAt: DS.attr('moment-date'),

  parent: DS.belongsTo('product', {
    inverse: 'variants',
    async: true
  }),

  variants: DS.hasMany('product', {
    inverse: 'parent',
    async: true
  }),

  author: DS.belongsTo('user', {
    async: true
  }),

  formatSlug: Ember.computed('slug', 'id', function() {
    return this.get('slug') + '-' + this.get('id');
  }),

  isDraft: Ember.computed.equal('status', 10),
  isPendingReview: Ember.computed.equal('status', 20),
  isPublished: Ember.computed.equal('status', 30),

  price: Ember.computed('unitPrice', 'variants.isSettled', 'variants.@each.unitPrice', function () {
    var variants = this.get('variants'),
      price = this.get('unitPrice'),
      priceVariants;

    if (variants.get('isFulfilled')) {
      priceVariants = Math.min(variants.mapBy('unitPrice'));
    }
    return priceVariants ? priceVariants : price;
  }),

  isAuthoredBy: function (user) {
    return parseInt(user.get('id'), 10) === parseInt(this.get('user.id'), 10);
  }
});
