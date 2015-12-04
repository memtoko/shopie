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
    var media = this.store.peekAll('medium'),
      medium;

    medium = media.find(function (medium) {
      return medium && !medium.get('isNew');
    });

    if (medium) {
      return this.transitionTo('media.medium', medium);
    }
  }
});
