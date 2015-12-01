import Ember from 'ember';

export default Ember.Controller.extend({
  accepting: false,
  rejecting: false,
  notifications: Ember.inject.service(),
  session: Ember.inject.service(),

  currentUser: Ember.computed.alias('session.user'),
  orderItems: Ember.computed.alias('model.items'),
  customer: Ember.computed.alias('model.user'),
  customerName: Ember.computed('model.user.username', 'model.fullName', function () {
    var fullName = this.get('model.fullName'),
      username = this.get('model.user.username');
    return fullName ? fullName : username;
  }),

  displayButtonAction: Ember.computed('model.status', function () {
    var status = this.get('model.status');
    return status === 30;
  }),

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
        order.set('acceptedAt', moment());
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
        order.set('rejectedAt', moment());
        order.set('rejectedBy', this.get('currentUser'));
        order.set('status', 50);
        return order;
      });
    }
  }
});
