import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'aside',
  classNames: 'sh-notifactions',
  notifications: Ember.inject.service(),
  messages: Ember.computed.alias('notifications.notifications')
});
