define('shopie/utils/validation-extensions', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    function init() {
        // Provide a few custom validators
        //
        validator.extend('empty', function (str) {
            return Ember['default'].isBlank(str);
        });

        validator.extend('notContains', function (str, badString) {
            return str.indexOf(badString) === -1;
        });
    }

    exports['default'] = {
        init: init
    };

});