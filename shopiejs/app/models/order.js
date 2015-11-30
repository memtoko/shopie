import DS from 'ember-data';
import Ember from 'ember';
import shopiePaths from '../utils/shopie-paths';

export default DS.Model.extend({
  status: DS.attr(),
  fullName: DS.attr(),
  email: DS.attr(),

  status: DS.attr('number'),

  createdAt: DS.attr('moment-date'),
  updatedAt: DS.attr('moment-date'),
  receivedAt: DS.attr('moment-date'),

  acceptedAt: DS.attr('moment-date'),
  acceptedBy: DS.belongsTo('user', {
    async: true
  }),

  rejectedAt: DS.attr('moment-date'),
  rejectedBy: DS.belongsTo('user', {
    async: true
  }),

  orderTotal: DS.attr(),
  orderSubtotal: DS.attr(),

  user: DS.belongsTo('user', {
    async: true
  }),

  items: DS.hasMany('order-item', {
    async: true
  }),

  orderKey: DS.attr(),

  isBuilding: Ember.computed.equal('status', 10),
  isConfirming: Ember.computed.equal('status', 20),
  isReceived: Ember.computed.equal('status', 30),
  isAccepted: Ember.computed.equal('status', 40),
  isRejected: Ember.computed.equal('status', 50),

  buildTime: Ember.computed('createdAt', 'receivedAt', function () {
    var receivedAt = this.get('receivedAt'),
      createdAt = this.get('createdAt');
    return receivedAt !== null ? receivedAt.diff(createdAt, 'hours') : null;
  }),

  isOwnedBy(user) {
    return parseInt(user.get('id'), 10) === parseInt(this.get('user.id'), 10);
  },

  acceptOrder() {
    return this.ajax.post(
      shopiePaths().url.api('orders', (this.get('id')).toString(), 'accept')
    );
  },

  rejectOrder() {
    return this.ajax.post(
      shopiePaths().url.api('orders', (this.get('id')).toString(), 'reject')
    );
  }
});
