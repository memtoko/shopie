import Ember from 'ember';
import AuthenticatedRouteStaff from '../shopie-authenticated-staff';
import isNumber, { isFinite } from '../../utils/number-type';

export default AuthenticatedRouteStaff.extend({

  model(params) {
    var mediumId,
     medium,
     query;

    mediumId = Number(params.medium_id);

    if (!isNumber(mediumId) || !isFinite(mediumId) || mediumId % 1 !== 0 || mediumId <= 0) {
      return this.transitionTo('error404', params.medium_id);
    }
    medium = this.store.peekRecord('medium', mediumId);
    if (medium) {
      return medium;
    }
    query = {
      id: mediumId,
      status: 'all'
    };
    return this.store.query('medium', query).then((medium) => {
      if (medium) {
        return medium;
      }
      return this.replaceRoute('medium.index');
    });
  }
});
