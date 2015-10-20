define('shopie/components/sh-infinite-scroll', ['exports', 'ember', 'shopie/mixins/infinite-scroll'], function (exports, Ember, InfiniteScroll) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({ InfiniteScroll: InfiniteScroll['default'] });

});