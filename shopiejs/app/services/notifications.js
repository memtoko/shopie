import Ember from 'ember';

let {get, set, computed} = Ember;
let { RSVP } = Ember;

function methodAlias(methodName) {
  return function () {
    return this[methodName].apply(this, arguments);
  };
}

export default Ember.Service.extend({
  delayedNotifications: Ember.A(),
  content: Ember.A(),

  alerts: computed.filter('content', function(notification) {
    return get(notification, 'status') === 'alert';
  }),

  notifications: computed.filter('content', function(notification) {
    return get(notification, 'status') === 'notification';
  }),

  handleNotification(message, delayed) {
    if (typeof message.toJSON === 'function' && message.get('status') === 'alert') {
      message.set('message', message.get('message').htmlSafe());
    }

    if (!get(message, 'status')) {
      set(message, 'status', 'notification');
    }

    if (!delayed) {
      this.get('content').pushObject(message);
    } else {
      this.get('delayedNotifications').pushObject(message);
    }

  },

  showAlert(message, options) {
    options = options || {};
    this.handleNotification({
      message: message,
      status: 'alert',
      type: options.type,
      key: options.key
    }, options.delayed);
  },

  showNotification(message, options) {
    options = options || {};

    if (!options.doNotCloseNotifications) {
      this.closeNotifications();
    } else {
      options.key = undefined;
    }

    this.handleNotification({
      message: message,
      status: 'notification',
      type: options.type,
      key: options.key
    }, options.delayed);
  },

  displayDelayed() {
    this.delayedNotifications.forEach((item) => {
      this.get('content').pushObject(item);
    });

    this.set('delayedNotifications', Ember.A());
  },

  closeNotification(notification) {
    let content = this.get('content');
    if (typeof notification.toJSON === 'function') {
      notification.deleteRecord();
      notification.save().finally(function() {
        content.removeObject(notification);
      });
    } else {
      content.removeObject(notification);
    }
  },

  closeNotifications() {
    this.set('content', this.get('content').rejectBy('status', 'notification'));
  },

  closeAll() {
    this.get('content').clear();
  },

  clearAll: methodAlias('closeAll')
});
