define('shopie/helpers/cycle-it', ['exports', 'ember', 'shopie/utils/cycle-generator'], function (exports, Ember, cycleGenerator) {

    'use strict';

    exports['default'] = Ember['default'].Helper.helper(function (params) {
        var gen = cycleGenerator['default'](params);
        return gen.next();
    });

});