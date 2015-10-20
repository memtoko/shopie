import Ember from 'ember';
export default Ember.Controller.extend({
    showCart: false,
    actions: {
        purchase: function purchase() {
            alert('kamu tertarik?');
        },
        read: function read() {
            var el = Ember.$('body');
            el.animate({
                scrollTop: Ember.$(".entry_content").offset().top
            }, 2000);
        }
    }
});