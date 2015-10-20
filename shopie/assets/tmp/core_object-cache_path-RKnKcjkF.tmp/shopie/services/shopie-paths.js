define('shopie/services/shopie-paths', ['exports', 'ember', 'shopie/utils/shopie-paths'], function (exports, Ember, shopiePaths) {

    'use strict';

    exports['default'] = Ember['default'].Service.extend(Ember['default']._ProxyMixin, {
        content: shopiePaths['default']()
    });

});