import Ember from 'ember';
import orderModel from 'shopie/models/order';

let watchedProps = ['models.items.[]'];
orderModel.eachAttribute(function (name) {
    watchedProps.push('model.' + name);
});
export default Ember.Controller.extend({
    items: function() {
        return this.get('model.items');
    }.property('model.items')
});
