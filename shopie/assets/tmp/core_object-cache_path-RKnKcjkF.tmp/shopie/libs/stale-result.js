define('shopie/libs/stale-result', ['exports'], function (exports) {

    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var StaleResult = (function () {
        function StaleResult() {
            _classCallCheck(this, StaleResult);

            this.hasResults = false;
            this._results = null;
        }

        _createClass(StaleResult, [{
            key: "results",
            set: function set(results) {
                if (results) {
                    this._results = results;
                    this.hasResults = true;
                }
            },
            get: function get() {
                return this._results;
            }
        }]);

        return StaleResult;
    })();

    exports['default'] = StaleResult;

});