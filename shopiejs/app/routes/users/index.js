import AuthenticatedRouteStaff from '../shopie-authenticated-staff';
import PaginationRouteMixin from '../../mixins/pagination-route';
import StyleBody from '../../mixins/style-body';

export default AuthenticatedRouteStaff.extend(StyleBody, PaginationRouteMixin, {
  titleToken: 'Users',
  classNames: ['view-user'],

  paginationModel: 'user',
  paginationSettings: {
    is_active: true,
    limit: 20
  },

  model() {
    return this.loadFirstPage();
  },

  actions: {
    reload() {
      this.refresh();
    }
  }
});
