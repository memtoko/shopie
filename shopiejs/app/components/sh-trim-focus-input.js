import Ember from 'ember';

export default Ember.TextField.extend({
  focus: true,
  classNames: 'sh-input',
  attributeBindings: ['autofocus'],

  autofocus: Ember.computed(function() {
    if (this.get('focus')) {
      return (device.ios()) ? false : 'autofocus';
    } else {
      return false;
    }
  }),

  focusField: Ember.on('didInsertElement', function() {
    if (this.get('focus') && !device.ios()) {
      this.$().val(this.$().val()).focus();
    }
  }),

  trimValue: Ember.on('focusOut', function() {
    this.$().val(this.$().val().trim());
  })
});
