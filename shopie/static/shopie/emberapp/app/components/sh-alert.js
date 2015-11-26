import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'article',
  classNames: ['sh-alert'],
  classNameBindings: ['typeClass'],

  notifications: Ember.inject.service(),

  typeClass: Ember.computed('message.type', function () {
    var classes = '',
      type = this.get('message.type'),
      typeMapping;

    typeMapping = {
      success: 'green',
      error: 'red',
      warn: 'yellow',
      info: 'blue'
    };

    if (typeMapping[type] !== undefined) {
      classes += 'sh-alert-' + typeMapping[type];
    }

    return classes;
  }),

  actions: {
    closeNotification: function () {
      this.get('notifications').closeNotification(this.get('message'));
    }
  }
});
