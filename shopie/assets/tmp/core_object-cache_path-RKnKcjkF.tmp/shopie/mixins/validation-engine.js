define('shopie/mixins/validation-engine', ['exports', 'ember', 'ember-data', 'shopie/utils/ajax', 'shopie/utils/validator-extensions', 'shopie/libs/validator/login', 'shopie/libs/validator/new-user'], function (exports, Ember, DS, getRequestErrorMessage, ValidatorExtensions, loginValidator, newUserValidator) {

    'use strict';

    ValidatorExtensions['default'].init();

    exports['default'] = Ember['default'].Mixin.create({
        validators: {
            login: loginValidator['default'],
            newUser: newUserValidator['default']
        },

        errors: DS['default'].Errors.create(),

        hasValidated: Ember['default'].A,

        validate: function validate(opts) {
            opts = opts || {};

            var model = this,
                type = undefined,
                validator = undefined,
                hasValidated = undefined;

            if (opts.model) {
                model = opts.model;
            } else if (this instanceof DS['default'].Model) {
                model = this;
            } else if (this.get('model')) {
                model = this.get('model');
            }

            type = this.get('validationType') || model.get('validationType');
            validator = this.get('validators.' + type) || model.get('validators.' + type);
            hasValidated = this.get('hasValidated');
            opts.validationType = type;

            return new Ember['default'].RSVP.Promise(function (resolve, reject) {
                var passed = undefined;
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

                return passed ? resolve() : reject();
            });
        },

        /**
        * The primary goal of this method is to override the `save` method on Ember Data models.
        * This allows us to run validation before actually trying to save the model to the server.
        * You can supply options to be passed into the `validate` method, since the ED `save` method takes no options.
        */
        save: function save(options) {
            var _this = this;

            // this is a hack, but needed for async _super calls.
            // ref: https://github.com/emberjs/ember.js/pull/4301
            var _super = this.__nextSuper;

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
            return this.validate(options).then(function () {
                return _super.call(_this, options);
            })['catch'](function (result) {
                // server save failed or validator type doesn't exist
                if (result && !Ember['default'].isArray(result)) {
                    // return the array of errors from the server
                    result = getRequestErrorMessage['default'](result);
                }

                return Ember['default'].RSVP.reject(result);
            });
        },
        actions: {
            validate: function validate(property) {
                this.validate({ property: property });
            }
        }
    });

});