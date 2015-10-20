import Ember from 'ember';
import cycleGenerator from 'shopie/utils/cycle-generator';

export default Ember.Helper.helper(function (params) {
    var gen = cycleGenerator(params);
    return gen.next();
});