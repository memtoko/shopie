import Ember from 'ember';

const ORDER_STATUSES = {
  10: 'building',
  20: 'confirming',
  30: 'received',
  40: 'accepted',
  50: 'rejected'
};

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['active', 'isReceived:received',
    'isRejected:rejected', 'isAccepted:accepted', 'isBuilding:building',
    'isConfirming:confirming'],

  order: null,
  active: false,
  previewIsHidden: false,

  shopiePaths: Ember.inject.service('shopie-paths'),

  isBuilding: Ember.computed.equal('order.status', 10),
  isConfirming: Ember.computed.equal('order.status', 20),
  isReceived: Ember.computed.equal('order.status', 30),
  isAccepted: Ember.computed.equal('order.status', 40),
  isRejected: Ember.computed.equal('order.status', 50),

  customerName: Ember.computed('order.user.username', 'ember.user.email', function () {
    return this.get('order.user.username') || this.get('order.user.email');
  }),

  statusName: Ember.computed('order.status', function () {
    let status = this.get('order.status');
    return ORDER_STATUSES[status];
  }),

  viewOrEdit: Ember.computed('previewIsHidden', function () {
    return this.get('previewIsHidden') ? 'orders.edit' : 'orders.order';
  }),

  click() {
    this.sendAction('onClick', this.get('order'));
  },

  doubleClick() {
    this.sendAction('onDoubleClick', this.get('order'));
  },

  didInsertElement() {
    this.addObserver('active', this, this.scrollIntoView);
  },

  willDestroyElement() {
    this.removeObserver('active', this, this.scrollIntoView);
  },

  scrollIntoView() {
    if (!this.get('active')) {
      return;
    }
    var element = this.$(),
      offset = element.offset().top,
      elementHeight = element.height(),
      container = Ember.$('.js-content-scrollbox'),
      containerHeight = container.height(),
      currentScroll = container.scrollTop(),
      isBelowTop,
      isAboveBottom,
      isOnScreen;

    isAboveBottom = offset < containerHeight;
    isBelowTop = offset > elementHeight;

    isOnScreen = isBelowTop && isAboveBottom;

    if (!isOnScreen) {
      // Scroll so that element is centered in container
      // 40 is the amount of padding on the container
      container.clearQueue().animate({
          scrollTop: currentScroll + offset - 40 - containerHeight / 2
      });
    }
  }
});
