import DS from 'ember-data';
import Ember from 'ember';
import shopiePaths from '../utils/shopie-paths';

let Promise = Ember.RSVP.Promise;

var promiseObject = function(promise, label) {
  return DS.PromiseObject.create({
    promise: Promise.resolve(promise, label)
  });
};

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),
  username: DS.attr('string'),
  dateJoined: DS.attr('moment-date'),

  _isStaff: Ember.computed('id', function () {
    var id = this.get('id').toString(),
      promise = this.ajax.request(
        shopiePaths().url.api('users', id, 'staff')
      ).then((response) => response.data || response);

    return promiseObject(promise, 'fect user staff');
  }).readOnly(),

  isStaff: Ember.computed.equal('_isStaff.is_staff').readOnly()

});
