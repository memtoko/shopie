"use strict";

// module Shopie.Validation

exports._validateEmail  = function (left, right, em) {
  var userRe = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
  if (/\s/.test(em) || em.indexOf('@') === -1) {
    return left('Enter a valid email');
  }
  var splitted = em.split('@');
  if (!userRe.test(splitted[0])) {
    return left('Enter a valid email');
  }
  return validateDomainPart(splitted[1]) ? right(em) : left('enter a valid email address');
}

function validateDomainPart(domain) {
  var parts = domain.split('.');
  var tld = parts.pop();
  if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
    return false;
  }
  for (var part, i = 0; i < parts.length; i++) {
    part = parts[i];

    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-' ||
      part.indexOf('---') >= 0) {
      return false;
    }
  }
  return true;
}
