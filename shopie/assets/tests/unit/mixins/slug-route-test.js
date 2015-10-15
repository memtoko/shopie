import Ember from 'ember';
import SlugRouteMixin from '../../../mixins/slug-route';
import { module, test } from 'qunit';

module('Unit | Mixin | slug route');

// Replace this with your real tests.
test('it works', function(assert) {
  var SlugRouteObject = Ember.Object.extend(SlugRouteMixin);
  var subject = SlugRouteObject.create();
  assert.ok(subject);
});
