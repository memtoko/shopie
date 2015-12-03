import Ember from 'ember';
import AuthenticatedRouteStaff from './shopie-authenticated-staff';

export default AuthenticatedRouteStaff.extend({
  model() {
    let store = this.get('store');
    return store.findAll('media');
  }
});
