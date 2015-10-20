define('shopie/services/config', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    function isNumeric(num) {
        return !isNaN(num);
    }

    function _mapType(val) {
        if (val === '') {
            return null;
        } else if (val === 'true') {
            return true;
        } else if (val === 'false') {
            return false;
        } else if (isNumeric(val)) {
            return +val;
        } else if (val.indexOf('{') === 0) {
            try {
                return JSON.parse(val);
            } catch (e) {
                /*jshint unused:false */
                return val;
            }
        } else {
            return val;
        }
    }

    exports['default'] = Ember['default'].Service.extend(Ember['default']._ProxyMixin, {
        content: Ember['default'].computed(function () {
            var metaConfigTags = Ember['default'].$('meta[name^="env-"]'),
                config = {};

            metaConfigTags.each(function (i, el) {
                var key = el.name,
                    value = el.content,
                    propertyName = key.substring(4);

                config[propertyName] = _mapType(value);
            });

            return config;
        })
    });

});