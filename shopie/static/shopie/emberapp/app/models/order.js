import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  status: DS.attr(),
  fullName: DS.attr(),
  email: DS.attr(),
  createdAt: DS.attr('moment-date'),
  updatedAt: DS.attr('moment-date'),
  receivedAt: DS.attr('moment-date'),
  orderTotal: DS.attr(),
  orderSubtotal: DS.attr(),
  user: DS.belongsTo('user', {
    async: true
  }),
  items: DS.hasMany('order-item', {
    async: true
  }),
  isOwnedBy: function (user) {
    return parseInt(user.get('id'), 10) === parseInt(this.get('user.id'), 10);
  }
});
