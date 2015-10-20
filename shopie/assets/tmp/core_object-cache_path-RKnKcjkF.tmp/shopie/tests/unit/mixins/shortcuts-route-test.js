define('shopie/tests/unit/mixins/shortcuts-route-test', ['ember', 'shopie/mixins/shortcuts-route', 'qunit'], function (Ember, ShortcutsRouteMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | shortcuts route');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var ShortcutsRouteObject = Ember['default'].Object.extend(ShortcutsRouteMixin['default']);
    var subject = ShortcutsRouteObject.create();
    assert.ok(subject);
  });

});