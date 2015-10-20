define('shopie/components/sh-infinite-scroll-box', ['exports', 'ember', 'shopie/mixins/infinite-scroll', 'shopie/utils/set-scroll-classname'], function (exports, Ember, InfiniteScrollMixin, setScrollClassName) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend(InfiniteScrollMixin['default'], {
        didRender: function didRender() {
            this._super();

            var el = this.$();

            el.on('scroll', Ember['default'].run.bind(el, setScrollClassName['default'], {
                target: el.closest('.content-list'),
                offset: 10
            }));
        },

        willDestroyElement: function willDestroyElement() {
            this._super();

            this.$().off('scroll');
        }
    });

});