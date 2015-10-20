define('shopie/tests/unit/utils/ctrl-or-cmd-test', ['shopie/utils/ctrl-or-cmd', 'qunit'], function (ctrlOrCmd, qunit) {

  'use strict';

  qunit.module('Unit | Utility | ctrl or cmd');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var result = ctrlOrCmd['default']();
    assert.ok(result);
  });

});