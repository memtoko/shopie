define('shopie/components/sh-gravatar', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({
        size: 200,
        email: '',

        gravatarUrl: Ember['default'].computed('email', 'size', function () {
            var emailHash = md5(this.get('email')),
                size = this.get('size');
            return 'http://www.gravatar.com/avatar/' + emailHash + '?s=' + size;
        })
    });

});