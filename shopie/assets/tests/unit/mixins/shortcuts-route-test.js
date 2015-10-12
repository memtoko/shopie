import Ember from 'ember';
import ShortcutsRouteMixin from '../../../mixins/shortcuts-route';
import { module, test } from 'qunit';

module('Unit | Mixin | shortcuts route');

// Replace this with your real tests.
test('it works', function(assert) {
  var ShortcutsRouteObject = Ember.Object.extend(ShortcutsRouteMixin);
  var subject = ShortcutsRouteObject.create();
  assert.ok(subject);
});
