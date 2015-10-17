import Ember from 'ember';
import cycleGenerator from 'shopie/utils/cycle-generator';

export default Ember.Helper.helper(function(params) {
    let gen = cycleGenerator(params);
    return gen.next();
});
