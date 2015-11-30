import Ember from 'ember';

export default Ember.Controller.extend({
  order: Ember.computed.alias('model'),
  items: Ember.computed.alias('order.items'),

  customerName: Ember.computed('model.user.username', 'model.fullName', function () {
    var fullName = this.get('model.fullName'),
      username = this.get('model.user.username');
    return fullName ? fullName : username;
  }),
});
