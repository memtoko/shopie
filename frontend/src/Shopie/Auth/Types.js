"use strict";

function mapType(val) {
  var e;
  if (val === '') {
    return null;
  } else if (val === 'true') {
    return true;
  } else if (val === 'false') {
    return false;
  } else if (!isNaN(val)) {
    return +val;
  } else if (val.indexOf('{') === 0) {
    try {
      return JSON.parse(val);
    } catch (_error) {
      e = _error;
      return val;
    }
  } else {
    return val;
  }
}

// module Shopie.Auth.Types
exports._readClient = function (nothing) {
  return function (just) {
    return function () {
      var metaConfigs = document.querySelectorAll('meta[name^="env-"]'),
          repositories = {};
      if (metaConfigs) {
        var len = metaConfigs.length,
          i, config, name, value, propertyName;
        // walk over this node list
        for (i = 0; i < len; i++) {
          config = metaConfigs[i];
          name = config.getAttribute('name');
          value = config.getAttribute('content');
          propertyName = name.substring(4);
          repositories[propertyName] = mapType(value);
        }
        return just(repositories);
      }
      return nothing;
    };
  };
}
