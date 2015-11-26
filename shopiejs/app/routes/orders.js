import Ember from 'ember';
import AuthenticatedStaffRoute from './shopie-authenticated-staff';
import ShortcutsRoute from '../mixins/shortcuts-route';
import PaginationRouteMixin from '../mixins/pagination-route';

export default AuthenticatedStaffRoute.extend(ShortcutsRoute, PaginationRouteMixin, {
  titleToken: 'Orders',
  paginationModel: 'order',

  model() {
    return this.loadFirstPage();
  },

  scrollContent(amount) {
    var content = Ember.$('.js-content-preview'),
      scrolled = content.scrollTop();

    content.scrollTop(scrolled + 50 * amount);
  }
});
