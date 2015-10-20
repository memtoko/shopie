define('shopie/mixins/style-body', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Mixin.create({
        activate: function activate() {
            this._super();

            var cssClasses = this.get('classNames');

            if (cssClasses) {
                Ember['default'].run.schedule('afterRender', null, function () {
                    cssClasses.forEach(function (curClass) {
                        Ember['default'].$('body').addClass(curClass);
                    });
                });
            }
        },

        deactivate: function deactivate() {
            this._super();

            var cssClasses = this.get('classNames');

            Ember['default'].run.schedule('afterRender', null, function () {
                cssClasses.forEach(function (curClass) {
                    Ember['default'].$('body').removeClass(curClass);
                });
            });
        }
    });

});