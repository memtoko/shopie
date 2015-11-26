import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  slug: DS.attr('string'),
  shortDescription: DS.attr('string'),
  description: DS.attr('string'),
  image: DS.attr('string'),
  unitPrice: DS.attr('string'),
  isActive: DS.attr('boolean'),
  status: DS.attr(),
  parent: DS.belongsTo('product', {
    inverse: 'variants'
  }),
  variants: DS.hasMany('product', {
    inverse: 'parent'
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

  isAuthoredBy: function (user) {
    return parseInt(user.get('id'), 10) === parseInt(this.get('user.id'), 10);
  }
});
