import Ember from 'ember';
import DropdownMixinMixin from '../../../mixins/dropdown-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | dropdown mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var DropdownMixinObject = Ember.Object.extend(DropdownMixinMixin);
  var subject = DropdownMixinObject.create();
  assert.ok(subject);
});
