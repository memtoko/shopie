define('shopie/controllers/index', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var headerImages = ["/static/images/home15.jpg", "/static/images/home14.jpg", "/static/images/home13.jpg"];

    exports['default'] = Ember['default'].Controller.extend({
        imageCover: Ember['default'].computed(function () {
            return headerImages[Math.floor(Math.random() * headerImages.length)];
        })
    });

});