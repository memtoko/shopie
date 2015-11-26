import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    if (serialized) {
      return moment(serialized);
    }
    return serialized;
  },

  serialize(deserialized) {
    if (deserialized) {
      return moment(deserialized).toDate();
    }
    return deserialized;
  }
});
