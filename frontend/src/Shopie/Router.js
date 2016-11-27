"use strict";

// module Shopie.Router

exports.routeChanged = function (handler) {
  return function () {
    var url = "";
    if (typeof window !== 'undefined') {
      url = window.location.pathname + window.location.search;
    }
    handler("")(url)()
    if (typeof window !== 'undefined') {
      window.onpopstate = function () {
        var newUrl = window.location.pathname + window.location.search;
        handler(url)(newUrl)();
        url = newUrl
      };
    }
  };
};

exports.decodeURIComponent = function(str) {
  if (typeof window !== "undefined") {
    return window.decodeURIComponent(str);
  } else {
    return global.decodeURIComponent(str);
  }
};
