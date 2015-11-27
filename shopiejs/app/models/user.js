import DS from 'ember-data';
import Ember from 'ember';
import shopiePaths from '../utils/shopie-paths';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),
  username: DS.attr('string'),
  dateJoined: DS.attr('moment-date'),

  /**
   * this information must not stored in all application instance (the value of is_staff,
   * as we seen in Django user model). Because it considered dangerous, to store it.
   * If we need that information, call this method and forget it.
   * usage:
   *
   * user.isStaff().then(function () {
   *   // okay user is staff
   * })
   */
  isStaff() {
    return this.ajax.request(
      shopiePaths().url.api('users', (this.get('id')).toString(), 'staff')
    ).then((response) => {
      if (response.is_staff) {
        return Ember.RSVP.resolve();
      } else {
        return Ember.RSVP.reject();
      }
    });
  }
});
