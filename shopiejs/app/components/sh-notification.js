import Ember from 'ember';

const ANIMATIONEVENT = 'animationend webkitAnimationEnd oanimationend MSAnimationEnd';
let typeMapping = {
  success: 'green',
  error: 'red',
  warn: 'yellow'
};

let { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['sh-notification', 'sh-notification-passive'],
  classNameBindings: ['typeClass'],
  message: null,

  notifications: Ember.inject.service(),

  typeClass: computed('message.type', function () {
    var type = this.get('message.type'),
      classes = '';

    if (typeMapping[type] !== undefined) {
      classes += `sh-notification-${typeMapping[type]}`;
    }
    return classes;
  }),

  didInsertElement() {
    this.$().on(ANIMATIONEVENT, (event) => {
      if (event.originalEvent.animationName === 'fade-out') {
        this.get('notifications').closeNotification(this.get('message'));
      }
    });
  },

  willDestroyElement() {
    this.$().off(ANIMATIONEVENT);
  },

  actions: {

    closeNotification() {
      this.get('notifications').closeNotification(this.get('message'));
    }
  }
});
