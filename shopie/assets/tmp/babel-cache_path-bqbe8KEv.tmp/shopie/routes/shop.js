import Ember from 'ember';
import ShortcutsRoute from 'shopie/mixins/shortcuts-route';
import PaginationRoute from 'shopie/mixins/pagination-route';
import styleBody from 'shopie/mixins/style-body';

export default Ember.Route.extend(styleBody, ShortcutsRoute, PaginationRoute, {
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
                return product.get('isActive');
            });
        });
    },

    setupCurrentMeta: function setupCurrentMeta(meta) {
        this.controller.set('currentMeta', meta);
    },

    scrollContent: function scrollContent(amount) {
        var content = Ember.$('.js-products'),
            scrolled = content.scrollTop();

        content.scrollTop(scrolled + 50 * amount);
    },

    shortcuts: {
        'v': 'viewProduct'
    }
});