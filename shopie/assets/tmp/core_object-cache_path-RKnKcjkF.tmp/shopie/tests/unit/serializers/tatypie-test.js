define('shopie/tests/unit/serializers/tatypie-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('tatypie', 'Unit | Serializer | tatypie', {
    // Specify the other units that are required for this test.
    needs: ['serializer:tatypie']
  });

  // Replace this with your real tests.
  ember_qunit.test('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

});