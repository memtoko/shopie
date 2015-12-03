import Ember from 'ember';
import AuthenticatedRouteStaff from './shopie-authenticated-staff';
import PaginationRouteMixin from '../mixins/pagination-route';

export default AuthenticatedRouteStaff.extend(PaginationRouteMixin, {
  titleToken: 'Media',
  paginationModel: 'medium',

  model() {
    return this.loadFirstPage();
  }
});
