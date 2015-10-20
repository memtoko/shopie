define('shopie/routes/product', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend({

        classNames: ['product', 'js-product'],

        titleToken: function titleToken() {
            return this.modelFor(this.routeName).get('name') || 'Product';
        },
        // Our server, serve this page by /product/{product-slug}-{pk}
        model: function model(params) {
            var splitted = params.product_slug.split('-');
            if (splitted.length) {
                var productPk = Number(splitted.pop());
                if (isNaN(productPk) || !isFinite(productPk) || productPk % 1 !== 0 || productPk <= 0) {
                    return this.redirectTo404(params.product_slug);
                }
                return this.store.findRecord('product', productPk);
            } else {
                return this.redirectTo404(params.product_slug);
            }
        },

        redirectTo404: function redirectTo404(slug) {
            return this.transitionTo('error404', slug);
        },

        serialize: function serialize(model) {
            return { product_slug: model.get('formatSlug') };
        }
    });

});