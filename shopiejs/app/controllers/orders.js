import Ember from 'ember';

function comparator(item1, item2) {
  var updated1 = item1.get('updatedAt'),
    updated2 = item2.get('updatedAt'),
    idResult,
    statusResult,
    updatedAtResult,
    receivedAtResult;

  // when `updated_at` is undefined, the model is still
  // being written to with the results from the server
  if (item1.get('isNew') || !updated1) {
    return -1;
  }

  if (item2.get('isNew') || !updated2) {
    return 1;
  }

  idResult = Ember.compare(parseInt(item1.get('id')), parseInt(item2.get('id')));
  statusResult = Ember.compare(item1.get('status'), item2.get('status'));
  updatedAtResult = Ember.compare(updated1.valueOf(), updated2.valueOf());
  receivedAtResult = receivedAtCompare(item1, item2);

  if (statusResult === 0) {
    if (receivedAtResult === 0) {
      if (updatedAtResult === 0) {
        // This should be DESC
        return idResult * -1;
      }
      // This should be DESC
      return updatedAtResult * -1;
    }
    // This should be DESC
    return receivedAtResult * -1;
  }

  return statusResult;
}

function acceptedAtCompare(item1, item2) {
  var received1 = item1.get('receivedAt'),
    received2 = item2.get('receivedAt');

  if (!received1 && !received2) {
    return 0;
  }

  if (!received1 && received2) {
    return -1;
  }

  if (!received2 && received1) {
    return 1;
  }

  return Ember.compare(received1.valueOf(), received2.valueOf());
}

export default Ember.Controller.extend({

  orderListFocused: Ember.computed.equal('keyboardFocus', 'orderList'),
  orderContentFocused: Ember.computed.equal('keyboardFocus', 'orderContent'),

  sortedOrders: Ember.computed('model.@each.status', 'model.@each.receivedAt', 'model.@each.isNew', 'model.@each.updatedAt', function () {
    var orderArray = this.get('model').toArray();

    return orderArray.sort(comparator);
  }),

  actions: {
    showOrderContent(order) {
      if (!order) {
        return;
      }
      this.transitionToRoute('orders.order', order);
    }
  }
});
