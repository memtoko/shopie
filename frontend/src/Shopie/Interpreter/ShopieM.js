"use strict";

// module Shopie.Interpreter.ShopieM

exports.normalizeExp = function (expiresIn) {
  return new Date((new Date().getTime()) + expiresIn * 1000).getTime();
};
