import Ember from 'ember';

export default Ember.Controller.extend({
  accepting: false,
  rejecting: false,
  notifications: Ember.inject.service(),
  session: Ember.inject.service(),

  currentUser: Ember.computed.alias('session.user'),

  actions: {
    acceptOrder() {
      let order = this.get('model');
      this.toggleProperty('accepting');
      order.acceptOrder().then((payload) => {
        this.toggleProperty('accepting');
        return payload;
      }, () => {
        this.toggleProperty('accepting');
        this.get('notifications').showAlert('Failed to accept order. :(', {
          key: 'order.accepting.failed'
        });
      }).then(() => {
        order.set('acceptedBy', this.get('currentUser'));
        order.set('status', 40);
        return order;
      });
    },

    rejectOrder() {
      let order = this.get('model');
      this.toggleProperty('rejecting');
      order.rejectOrder().then((payload) => {
        this.toggleProperty('rejecting');
        return payload;
      }, () => {
        this.toggleProperty('rejecting');
        this.get('notifications').showAlert('Failed to reject order. :(', {
          key: 'order.rejecting.failed'
        });
      }).then(() => {
        order.set('rejectedBy', this.get('currentUser'));
        order.set('status', 50);
        return order;
      });
    }
  }
});
