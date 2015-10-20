define('shopie/components/sh-input', ['exports', 'ember', 'shopie/mixins/text-input'], function (exports, Ember, TextInputMixin) {

    'use strict';

    exports['default'] = Ember['default'].TextField.extend(TextInputMixin['default'], {
        classNames: ['sh-input']
    });

});