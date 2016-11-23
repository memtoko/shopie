"use strict";

// module Shopie.Query.SessionF

exports.subscribeToLS = function (key) {
  return function (eff) {
    return function () {
      window.addEventListener('storage', function () {
        _restoreSessionData(key, eff)()
      }, false);
      return {};
    }
  }
}

exports.restoreSessionData = function (key) {
  return function (eff) {
    return function () {
      var data = window.localStorage.getItem(key);
      eff(JSON.parse(data) || {})();
      return {};
    }
  }
}
