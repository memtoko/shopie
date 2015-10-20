define('shopie/routes/index', ['exports', 'ember', 'shopie/mixins/style-body'], function (exports, Ember, styleBody) {

    'use strict';

    exports['default'] = Ember['default'].Route.extend(styleBody['default'], {
        classNames: ['home', 'js-home'],
        titleToken: 'Home',

        renderTemplate: function renderTemplate() {
            this.render('cover/home', {
                into: 'application',
                outlet: 'header-cover'
            });
            this.render('index');
        }
    });

});