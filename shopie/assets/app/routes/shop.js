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

    model: function () {
        return this.loadFirstPage().then(() => {
            return this.store.filter('product', (product) => product.get('isActive'));
        });
    },

    scrollContent: function (amount) {
        let content = Ember.$('.js-products'),
            scrolled = content.scrollTop();

        content.scrollTop(scrolled + 50 * amount);
    },

    shortcuts: {
        'v': 'viewProduct'
    }
});
