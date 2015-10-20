define('shopie/libs/validators/base', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var _this2 = undefined;

    var BaseValidator = Ember['default'].objects.extend({
        properties: [],
        passed: false,

        check: function check(model, prop) {
            var _this = this;

            this.set('passed', true); //default

            if (prop && this[prop]) {
                this[prop](model);
            } else {
                this.get('properties').forEach(function (property) {
                    if (_this[property]) {
                        _this[property](model);
                    }
                });
            }
            return this.get('passed');
        },

        invalidate: function invalidate() {
            return _this2.set('passed', false);
        }
    });

    exports['default'] = BaseValidator;

});