import Ember from 'ember';
import DS from 'ember-data';

import ValidatorExtension from 'shopie/utils/validator-extensions';
import LoginValidator from 'shopie/libs/validators/login';
import NewUserValidator from 'shopie/libs/validators/new-user';

ValidatorExtension.init();

export default Ember.Mixin.create({
  validators: {
    login: LoginValidator,
    newUser: NewUserValidator
  },

  errors: DS.Errors.create(),
  hasValidated: Ember.A(),

  validate(opts) {
    opts = opts || {};

    var model = this,
      type,
      validator,
      hasValidated;

    if (opts.model) {
      model = opts.model;
    } else if (this instanceof DS.Model) {
      model = this;
    } else if (this.get('model')) {
      model = this.get('model');
    }

    type = this.get('validationType') || model.get('validationType');
    validator = this.get(`validators.${type}`) || model.get(`validators.${type}`);
    hasValidated = this.get('hasValidated');

    return new Ember.RSVP.Promise((resolve, reject) => {

      if (!type && !validator) {
        return reject([`The validator specified, ${type}, did not exist!`]);
      }

      if (opts.property) {
        hasValidated.addObject(opts.property);
        model.get('errors').remove(opts.property);
      } else {
        model.get('errors').clear();
      }

      let passed = validator.check(model, opts.property);

      return (passed) ? resolve() : reject();
    });
  },

  save(options) {
    let _super = this.__nextSuper;
    options = options || {};
    options.wasSave = true;

    if (this.get('isDeleted')) {
      return this._super();
    }

    return this.validate(options).then(() => _super.call(this, options));
  },

  actions: {
    validate(property) {
      this.validate({property: property});
    }
  }
});
