import Ember from 'ember';

export default Ember.Controller.extend({
    showCart: false,
	actions: {
        openQuickView: function (product) {
            this.send('openModal', 'quick-view', product);
        }
    }
});
