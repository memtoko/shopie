import Ember from 'ember';
import AuthenticatedRouteStaff from './shopie-authenticated-staff';

export default AuthenticatedRouteStaff.extend({

  model() {
    return this.store.findAll('medium');
  }
});
