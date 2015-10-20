define('shopie/models/user', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        firstName: DS['default'].attr('string'),
        lastName: DS['default'].attr('string'),
        email: DS['default'].attr('string')
    });

});