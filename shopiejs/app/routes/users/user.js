import AuthenticatedRouteStaff from '../shopie-authenticated-staff';
import StyleBody from '../../mixins/style-body';
import isNumber, { isFinite } from '../../utils/number-type';

export default AuthenticatedRouteStaff.extend(StyleBody, {
  titleToken: 'User',
  model(params) {
    let userId = Number(params.user_id);
    if (!isNumber(userId) || !isFinite(userId) || userId % 1 !== 0 || userId <= 0) {
      return this.transitionTo('error404', params.user_id);
    }
    return this.store.peekRecord('user', userId);
  },

  deactivate() {
    let model = this.modelFor('users.user');

    if (model && model.get('hasDirtyAttributes')) {
      model.rollbackAttributes();
    }

    model.get('errors').clear();
    this._super(...arguments);
  },

  actions: {

    didTransition() {
      this.modelFor('users.user').get('errors').clear();
    },

    save() {
      this.get('controller').send('save');
    }
  }
});
