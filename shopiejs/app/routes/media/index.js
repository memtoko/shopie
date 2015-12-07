import AuthenticatedRouteMixin from '../../mixins/authenticated-staff';
import MobileRoute from '../mobile-route';
import mobileQuery from '../../libs/mobile-query';

export default MobileRoute.extend(AuthenticatedRouteMixin, {
  beforeModel() {
    if (!mobileQuery.matches) {
      return this.goToMedium();
    }
  },

  goToMedium() {
    var media = this.modelFor('media').get('firstObject');

    if (media) {
      this.transitionTo('media.medium', media);
    }
  }
});
