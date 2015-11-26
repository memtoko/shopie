import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  buttonText: '',
  submitting: false,
  showSpinner: false,
  showSpinnerTimeout: null,
  autoWidth: true,
  attributeBindings: ['disabled', 'type', 'tabindex'],

  disabled: Ember.computed.equal('showSpinner', true),

  click() {
    if (this.get('action')) {
      this.sendAction('action');
      return false;
    } else {
      return true;
    }
  },

  toggleSpinner: Ember.observer('submitting', function() {
    var submitting = this.get('submitting'),
        timeout = this.get('showSpinnerTimeout');

    if (submitting) {
      this.set('showSpinner', true);
      this.set('showSpinnerTimeout', Ember.run.later(this, (function(_this) {
        return function() {
          if (!_this.get('submitting')) {
            _this.set('showSpinner', false);
          }
          _this.set('showSpinnerTimeout', null);
        };
      })(this), 1000));
    } else if (!submitting && timeout === null) {
      this.set('showSpinner', false);
    }
  }),

  setSize: Ember.observer('showSpinner', function() {
    if (this.get('showSpinner') && this.get('autoWidth')) {
      this.$().width(this.$().width());
      return this.$().height(this.$().height());
    } else {
      this.$().width('');
      return this.$().height('');
    }
  }),

  willDestroy() {
    return Ember.run.cancel(this.get('showSpinnerTimeout'));
  }
});
