define('shopie/components/sh-trim-focus-input', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var TrimFocusInput = Ember['default'].TextField.extend({
        focus: true,
        classNames: ['sh-input'],
        attributeBindings: ['autofocus'],

        autofocus: Ember['default'].computed(function () {
            if (this.get('focus')) {
                return device.ios() ? false : 'autofocus';
            }

            return false;
        }),

        focusField: Ember['default'].on('didInsertElement', function () {
            // This fix is required until Mobile Safari has reliable
            // autofocus, select() or focus() support
            if (this.get('focus') && !device.ios()) {
                this.$().val(this.$().val()).focus();
            }
        }),

        trimValue: Ember['default'].on('focusOut', function () {
            var text = this.$().val();
            this.$().val(text.trim());
        })
    });

    exports['default'] = TrimFocusInput;

});