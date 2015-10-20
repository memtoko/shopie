define('shopie/transforms/moment-date', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Transform.extend({
        deserialize: function deserialize(serialized) {
            if (serialized) {
                return moment(serialized);
            }
            return serialized;
        },

        serialize: function serialize(deserialized) {
            if (deserialized) {
                return moment(deserialized).toDate();
            }
            return deserialized;
        }
    });

});