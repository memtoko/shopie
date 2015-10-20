/* jshint ignore:start */

define('shopie/config/environment', ['ember'], function(Ember) {
  var prefix = 'shopie';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("shopie/tests/test-helper");
} else {
  require("shopie/app")["default"].create({"API_HOST":null,"API_NAMESPACE":"api/v1","name":"shopie","version":"0.0.0+8bb31f85"});
}

/* jshint ignore:end */
