import Ember from 'ember';

export default Ember.Route.extend({
    titleToken: 'Cart',
    classNames: ['cart', 'js-cart'],

    config: Ember.inject.service(),
    notifications: Ember.inject.service(),
    shoppingCart: Ember.inject.service('shopping-cart'),

    model: function() {
        let shoppingCart = this.get('shoppingCart'),
            cartId = shoppingCart.retrieve();
        if (cartId === null) {
            let cart = this.store.createRecord('order', {
                'email': 'customer@placeholder.com'
            });
            cart.save();
            shoppingCart.set(cart.id);
            return cart;
        } else {
            return this.store.findRecord('order', cartId);
        }
    },

    actions: {
        refreshCart: function() {
            this.model();
        }
    }
});
