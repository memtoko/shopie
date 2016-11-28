"use strict";

// module Control.Monad.Eff.Clock

exports.now = function () {
  return Date.now();
}

exports.nowOffset = function () {
  var dt = new Date();
  return dt.getTimezoneOffset();
};
