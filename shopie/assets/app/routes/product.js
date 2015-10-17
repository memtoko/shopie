import Ember from 'ember';

export default Ember.Route.extend({

    classNames: ['product', 'js-product'],

    titleToken: function() {
        return this.modelFor(this.routeName).get('name') || 'Product';
    },
    // Our server, serve this page by /product/{product-slug}-{pk}
    model: function(params) {
        let splitted = params.product_slug.split('-');
        if (splitted.length) {
            const productPk = Number(splitted.pop());
            if (isNaN(productPk) || !isFinite(productPk) || productPk % 1 !== 0 || productPk <= 0) {
                return this.redirectTo404(params.product_slug);
            }
            return this.store.findRecord('product', productPk);
        } else {
            return this.redirectTo404(params.product_slug);
        }
    },

    redirectTo404: function(slug) {
        return this.transitionTo('error404', slug);
    },

    serialize: function(model) {
        return { product_slug: model.get('formatSlug') };
    }
});
