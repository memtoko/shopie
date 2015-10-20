define('shopie/utils/ctrl-or-cmd', ['exports'], function (exports) {

	'use strict';

	var ctrlOrCmd = navigator.userAgent.indexOf('Mac') !== -1 ? 'command' : 'ctrl';

	exports['default'] = ctrlOrCmd;

});