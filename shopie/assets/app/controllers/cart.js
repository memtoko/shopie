import Ember from 'ember';
import CartModel from 'shopie/models/cart';

let watchedProps = ['models.items.[]'];
CartModel.eachAttribute(function (name) {
    watchedProps.push('model.' + name);
});
export default Ember.Controller.extend({
    items: function() {
        return this.get('model.items');
    }.property('model.items')
});
