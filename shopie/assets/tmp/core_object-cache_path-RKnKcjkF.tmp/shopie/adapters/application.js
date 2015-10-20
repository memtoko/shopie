define('shopie/adapters/application', ['exports', 'shopie/adapters/base'], function (exports, BaseAdapter) {

	'use strict';

	var ApplicationAdapter = BaseAdapter['default'].extend();

	exports['default'] = ApplicationAdapter;

});