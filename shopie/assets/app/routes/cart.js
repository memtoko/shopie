import Ember from 'ember';

export default Ember.Route.extend({
    titleToken: 'Cart',
    classNames: ['cart', 'js-cart'],

    config: Ember.inject.service(),

    model: function() {
        let cartId = this.get('config.currentCart');
        return this.get('store').findRecord('cart', cartId).then((cart) => {
            let items = cart.get('items');
            return cart;
        });
    },

    actions: {
        refreshCart: function() {
            this.model();
        }
    }
});
