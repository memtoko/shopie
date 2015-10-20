define('shopie/routes/shop', ['exports', 'ember', 'shopie/mixins/shortcuts-route', 'shopie/mixins/pagination-route', 'shopie/mixins/style-body'], function (exports, Ember, ShortcutsRoute, PaginationRoute, styleBody) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend(styleBody['default'], ShortcutsRoute['default'], PaginationRoute['default'], {
        titleToken: 'Shop',
        paginationModel: 'product',
        classNames: ['shop', 'js-shop'],

        paginationSettings: {
            page: 1,
            limit: 20
        },

        model: function model() {
            var _this = this;

            return this.loadFirstPage().then(function () {
                return _this.store.filter('product', function (product) {
                    return product.get('isActive') && product.get('productType') !== 30;
                });
            });
        },

        setupCurrentMeta: function setupCurrentMeta(meta) {
            this.controller.set('currentMeta', meta);
        },

        scrollContent: function scrollContent(amount) {
            var content = Ember['default'].$('.js-products'),
                scrolled = content.scrollTop();

            content.scrollTop(scrolled + 50 * amount);
        },

        shortcuts: {
            'v': 'viewProduct'
        }
    });

});