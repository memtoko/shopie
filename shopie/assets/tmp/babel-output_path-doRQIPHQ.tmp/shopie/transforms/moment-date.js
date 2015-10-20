import DS from 'ember-data';
/* global moment */
export default DS.Transform.extend({
    deserialize: function deserialize(serialized) {
        if (serialized) {
            return moment(serialized);
        }
        return serialized;
    },

    serialize: function serialize(deserialized) {
        if (deserialized) {
            return moment(deserialized).toDate();
        }
        return deserialized;
    }
});