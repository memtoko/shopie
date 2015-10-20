import Ember from 'ember';
import Base from 'simple-auth/authorizers/base';

export default Base.extend({
    authorize: function authorize(jqXHR, requestOptions) {
        var secureData = this.get('session.secure');
        var accessToken = secureData.token;
        if (this.get('session.isAuthenticated') && !Ember.isEmpty(accessToken)) {
            jqXHR.setRequestHeader('Authorization', 'Token  ' + accessToken);
        }
    }
});