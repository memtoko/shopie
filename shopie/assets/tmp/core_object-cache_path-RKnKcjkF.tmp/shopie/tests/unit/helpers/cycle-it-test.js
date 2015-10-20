define('shopie/tests/unit/helpers/cycle-it-test', ['shopie/helpers/cycle-it', 'qunit'], function (cycle_it, qunit) {

  'use strict';

  qunit.module('Unit | Helper | cycle it');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var result = cycle_it.cycleIt(42);
    assert.ok(result);
  });

});