import Ember from 'ember';

let {isEmpty, computed} = Ember;

export default Ember.Mixin.create({
  errors: null,
  property: '',
  hasValidated: Ember.A(),

  hasError: computed('errors.[]', 'property', 'hasValidated.[]', function() {
    var property = this.get('property'),
      errors = this.get('errors'),
      hasValidated = this.get('hasValidated');

    if (!property && !isEmpty(errors)) {
      return true;
    }

    if (!hasValidated || !hasValidated.contains(property)) {
      return false;
    }

    if (errors) {
      return errors.get(property);
    }

    return false;
  })
});
