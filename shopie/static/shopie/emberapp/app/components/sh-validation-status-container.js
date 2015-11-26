import Ember from 'ember';
import ValidationStateMixin from 'shopie/mixins/validation-state';

export default Ember.Component.extend(ValidationStateMixin, {
  classNameBindings: ['errorClass'],

  errorClass: Ember.computed('property', 'hasError', 'hasValidated.[]', function() {
    let hasValidated = this.get('hasValidated');
    let property = this.get('property');

    if (hasValidated && hasValidated.contains(property)) {
      return this.get('hasError') ? 'error' : 'success';
    } else {
      return '';
    }
  })
});
