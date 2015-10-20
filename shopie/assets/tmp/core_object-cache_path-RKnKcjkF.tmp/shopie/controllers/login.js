define('shopie/controllers/login', ['exports', 'ember', 'shopie/mixins/validation-engine', 'ic-ajax'], function (exports, Ember, ValidationEngine, ic_ajax) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend(ValidationEngine['default'], {
        submitting: false,
        loggingIn: false,
        authProperties: ['identification', 'password']

    });

});