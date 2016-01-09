import Ember from 'ember';
import Configuration from 'ember-simple-auth/configuration';

const { service } = Ember.inject;

const INFINITEROUTEMESSAGE = 'The route configured as Configuration.' +
  'authenticationRoute cannot implement the AuthenticatedRouteMixin mixin as' +
  'that leads to an infinite transitioning loop!';

function assertRoute(name) {
  Ember.assert(INFINITEROUTEMESSAGE, name !== Configuration.authenticationRoute);
}
/**
* Django, or our application have concept user is staff and not. Include this mixin
* if you want your route accessible only if user is authenticated and they are staff
*
*/

function rejectUser(transition) {
  transition.abort();
  this.get('session').set('attemptedTransition', transition);
  assertRoute(this.get('routeName'));
  this.transitionTo(Configuration.authenticationRoute);
}

export default Ember.Mixin.create({

  /**
   * session service
   */
  session: service('session'),

  beforeModel(transition) {
    if (!this.get('session.isAuthenticated')) {
      rejectUser.call(this, transition);
    } else {
      let _super = this.__nextSuper;
      return this.get('session.user').then((user) => {
        var isStaff = user.get('_isStaff');
        isStaff.then(() => {
          var isStaffUser = isStaff.get('is_staff');
          if (! isStaff) {
            transition.send('invalidateSession');
            rejectUser.call(this, transition);
          } else {
            _super.call(this, transition);
          }
        });
      });
    }
  }
});
