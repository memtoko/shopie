define('shopie/mixins/slug-route', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Mixin.create({

        model: null,

        serialize: function serialize(model, params) {
            return { product_id: model.get('slug') + '-' + model.get('id') };
        }
    });

});