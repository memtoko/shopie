import DS from 'ember-data';

const STATE_BUILDING = 10;
const STATE_CONFIRMING = 20;
const STATE_RECEIVED = 30;
const STATE_ACCEPTED = 40;
const STATE_REJECTED = 50;

const ORDER_STATES = [
    [STATE_BUILDING, 'Building'],
    [STATE_CONFIRMING, 'Confirming'],
    [STATE_RECEIVED, 'Received'],
    [STATE_ACCEPTED, 'Accepted'],
    [STATE_REJECTED, 'Rejected']
];

/* global moment */
export default DS.Transform.extend({
    deserialize: function(serialized) {
        if (serialized) {
            for (let state of ORDER_STATES) {
                if (state[1] === serialized) {
                    return state[0];
                }
            }
        }
        return serialized;
    },

    serialize: function(deserialized) {
        if (deserialized) {
            for (let state of ORDER_STATES) {
                if (state[0] === deserialized) {
                    return state[1];
                }
            }
        }
        return deserialized;
    }
});
