define('shopie/tests/unit/mixins/body-event-listener-test', ['ember', 'shopie/mixins/body-event-listener', 'qunit'], function (Ember, BodyEventListenerMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | body event listener');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var BodyEventListenerObject = Ember['default'].Object.extend(BodyEventListenerMixin['default']);
    var subject = BodyEventListenerObject.create();
    assert.ok(subject);
  });

});