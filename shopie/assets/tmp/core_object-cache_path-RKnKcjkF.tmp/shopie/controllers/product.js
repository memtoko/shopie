define('shopie/controllers/product', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Controller.extend({
        showCart: false,
        actions: {
            purchase: function purchase() {
                alert('kamu tertarik?');
            },
            read: function read() {
                var el = Ember['default'].$('body');
                el.animate({
                    scrollTop: Ember['default'].$(".entry_content").offset().top
                }, 2000);
            }
        }
    });

});