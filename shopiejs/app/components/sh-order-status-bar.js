import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'aside',
  classNames: ['sh-order-status-bar'],

  order: null,

  accepter: Ember.computed.alias('order.acceptedBy'),
  accepterName: Ember.computed.alias('order.acceptedBy.username'),

  rejecter: Ember.computed.alias('order.rejectedBy'),
  rejecterName: Ember.computed.alias('order.rejectedBy.username')
});
