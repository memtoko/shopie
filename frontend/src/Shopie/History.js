"use strict";

// module Shopie.History

exports.update_ = function (method) {
  return function (state) {
    return function () {
      window.history[method](state.data, state.title, state.url);
      window.dispatchEvent(new Event('popstate'));
    };
  };
};

exports.back_ = function () {
  window.history.back();
};

exports.forward_ = function () {
  window.history.forward();
};

exports.go_ = function (num) {
  return function () {
    history.go(num);
  };
};
