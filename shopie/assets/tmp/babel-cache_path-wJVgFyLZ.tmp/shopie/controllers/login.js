import Ember from 'ember';
import ValidationEngine from 'shopie/mixins/validation-engine';
import { request as ajax } from 'ic-ajax';

export default Ember.Controller.extend(ValidationEngine, {
    submitting: false,
    loggingIn: false,
    authProperties: ['identification', 'password']

});