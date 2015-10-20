import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    classNames: ['sh-product', 'product', 'js-product'],

    actions: {
        view: function view(product) {
            this.sendAction('view', product);
        }
    }
});