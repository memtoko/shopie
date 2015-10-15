import Ember from 'ember';
import cycleGenerator from 'shopie/utils/cycle-generator';

export function cycleIt(params/*, hash*/) {
    let gen = cycleGenerator(params);
    return gen.next();
}

export default Ember.Helper.helper(cycleIt);
