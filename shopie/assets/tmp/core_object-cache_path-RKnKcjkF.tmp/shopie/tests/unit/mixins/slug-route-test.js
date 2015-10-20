define('shopie/tests/unit/mixins/slug-route-test', ['ember', 'shopie/mixins/slug-route', 'qunit'], function (Ember, SlugRouteMixin, qunit) {

  'use strict';

  qunit.module('Unit | Mixin | slug route');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var SlugRouteObject = Ember['default'].Object.extend(SlugRouteMixin['default']);
    var subject = SlugRouteObject.create();
    assert.ok(subject);
  });

});