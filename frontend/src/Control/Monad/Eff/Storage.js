"use strict";

// module Control.Monad.Eff.Storage

// Session storage, will persist / accessible by the window that created it is open.

exports._setSessionStorage = function (key, value) {
  return function () {
    window.sessionStorage.setItem(key, value);
    return {};
  };
};

exports._getSessionStorage = function (just, nothing, key) {
  return function () {
    var result = window.sessionStorage.getItem(key);
    // Storage interface return null if doesn't exists, if exists return DomString
    // https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
    return result === null ? nothing : just(result);
  };
};

exports.removeSessionStorage = function (key) {
  return function () {
    window.sessionStorage.removeItem(str);
    return {};
  };
};

// localStorage, it's similiar to sessionStorage, The only difference is that,
// while data stored in localStorage has no expiration time

exports._setLocalStorage = function (key, value) {
  return function () {
    window.localStorage.setItem(key, value);
    return {};
  };
};

exports._getLocalStorage = function (just, nothing, key) {
  return function () {
    var result = window.localStorage.getItem(key);
    return result === null ? nothing : just(result);
  };
};

exports.removeLocalStorage = function (key) {
  return function () {
    window.sessionStorage.removeItem(str);
    return {};
  };
};
