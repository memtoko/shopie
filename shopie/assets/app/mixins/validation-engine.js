import Ember from 'ember';
import DS from 'ember-data';
import getRequestErrorMessage from 'shopie/utils/ajax';
import ValidatorExtensions from 'shopie/utils/validator-extensions';

import loginValidator from 'shopie/libs/validators/login';
import newUserValidator from 'shopie/libs/validators/new-user';

ValidatorExtensions.init();

export default Ember.Mixin.create({
    validators: {
        login: loginValidator,
        newUser: newUserValidator
    },

    errors: DS.Errors.create(),

    hasValidated: Ember.A(),

    validate: function(opts) {
        opts = opts || {};

        let model = this,
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
        validator = this.get('validators.' + type) || model.get('validators.' + type);
        hasValidated = this.get('hasValidated');
        opts.validationType = type;

        return new Ember.RSVP.Promise(function (resolve, reject) {
            let passed;
            if (!type || !validator) {
                return reject(['The validator specified, "' + type + '", did not exist!']);
            }

            if (opts.property) {
                // If property isn't in `hasValidated`, add it to mark that this field can show a validation result
                hasValidated.addObject(opts.property);
                model.get('errors').remove(opts.property);
            } else {
                model.get('errors').clear();
            }

            passed = validator.check(model, opts.property);

            return (passed) ? resolve() : reject();
        });
    },

    /**
    * The primary goal of this method is to override the `save` method on Ember Data models.
    * This allows us to run validation before actually trying to save the model to the server.
    * You can supply options to be passed into the `validate` method, since the ED `save` method takes no options.
    */
    save: function (options) {
        // this is a hack, but needed for async _super calls.
        // ref: https://github.com/emberjs/ember.js/pull/4301
        let _super = this.__nextSuper;

        options = options || {};
        options.wasSave = true;

        // model.destroyRecord() calls model.save() behind the scenes.
        // in that case, we don't need validation checks or error propagation,
        // because the model itself is being destroyed.
        if (this.get('isDeleted')) {
            return this._super();
        }

        // If validation fails, reject with validation errors.
        // If save to the server fails, reject with server response.
        return this.validate(options).then(() => {
            return _super.call(this, options);
        }).catch((result) => {
            // server save failed or validator type doesn't exist
            if (result && !Ember.isArray(result)) {
                // return the array of errors from the server
                result = getRequestErrorMessage(result);
            }

            return Ember.RSVP.reject(result);
        });
    },
    actions: {
        validate: function (property) {
            this.validate({property: property});
        }
    }
});
