import Ember from 'ember';
import BodyEventListenerMixin from 'client/mixins/body-event-listener';

module('BodyEventListenerMixin');

// Replace this with your real tests.
test('it works', function() {
  var BodyEventListenerObject = Ember.Object.extend(BodyEventListenerMixin);
  var subject = BodyEventListenerObject.create();
  ok(subject);
});
