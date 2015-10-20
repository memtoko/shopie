define('shopie/tests/unit/utils/shopie-paths-test', ['shopie/utils/shopie-paths', 'qunit'], function (shopiePaths, qunit) {

  'use strict';

  qunit.module('Unit | Utility | shopie paths');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var result = shopiePaths['default']();
    assert.ok(result);
  });

});