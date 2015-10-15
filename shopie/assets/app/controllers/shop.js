import Ember from 'ember';
import PaginationControllerMixin from 'shopie/mixins/pagination-controller';

export default Ember.Controller.extend(PaginationControllerMixin, {
    showCart: false,
	actions: {
        openQuickView: function (product) {
            this.send('openModal', 'quick-view', product);
        }
    }
});
