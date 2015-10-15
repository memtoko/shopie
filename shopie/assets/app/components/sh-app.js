import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['sh-app'],
    showCart: false,

    /**
    * todo: build logic to display cart
    * @type {Array}
    */
    showCartContent: Ember.observer('showCart', function () {
        var showSettingsMenu = this.get('showCart');
    })
});
