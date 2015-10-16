import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'aside',
    classNames: 'sh-notifications',

    notifications: Ember.inject.service(),

    messages: Ember.computed.alias('notifications.notifications')
});
