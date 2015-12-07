import Ember from 'ember';

export default Ember.Controller.extend({
  accepting: false,
  rejecting: false,
  isEditing: false,
  buffer: null,
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

  _createBuffer: Ember.on('init', function () {
    this.set('buffer', Object.create(null));
  }),

  displayButtonAction: Ember.computed('model.status', function () {
    var status = this.get('model.status');
    return status === 30;
  }),

  actions: {

    toggleEditMode() {
      let mode = this.get('isEditing');
      if (mode) {
        let buffer = this.get('buffer');
        let order = this.get('model');
        order.setProperties(buffer);
        this.set('buffer', Object.create(null));
        if (order.get('hasDirtyAttributes')) {
          order.save();
        }
      }
      this.toggleProperty('isEditing');
    },

    cancelEdit() {
      this.set('buffer', Object.create(null));
      this.toggleProperty('isEditing');
    },

    orderNameDidChange(value) {
      this.set('buffer.fullName', value);
    },

    orderEmailDidChange(value) {
      this.set('buffer.email', value);
    },

    acceptOrder() {
      let order = this.get('model'),
        store = this.get('store'),
        notifications = this.get('notifications')

      this.toggleProperty('accepting');
      order.acceptOrder().then((payload) => {
        this.toggleProperty('accepting');
        this.store.pushPayload('order', payload);
        return payload;
      }).catch(() => {
        this.toggleProperty('accepting');
        notifications.showAlert('Failed to accept order.', {
          key: 'order.accepting.failed'
        });
      });
    },

    rejectOrder() {
      let order = this.get('model');
      this.toggleProperty('rejecting');
      order.rejectOrder().then((payload) => {
        this.toggleProperty('rejecting');
        this.store.pushPayload('order', payload);
        return payload;
      }).catch(() => {
        this.toggleProperty('rejecting');
        this.get('notifications').showAlert('Failed to reject order.', {
          key: 'order.rejecting.failed'
        });
      });
    }
  }
});
