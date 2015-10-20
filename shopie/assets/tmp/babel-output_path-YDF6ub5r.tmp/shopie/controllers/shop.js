import Ember from 'ember';

export default Ember.Controller.extend({
    showCart: false,
    actions: {
        openQuickView: function openQuickView(product) {
            this.send('openModal', 'quick-view', product);
        }
    }
});