import DS from 'ember-data';
import Ember from 'ember';

let { merge } = Ember;

export default DS.JSONAPISerializer.extend({
  /*
  doesnt pass `file` attribute to server, as our server complaint it,
  the file uploading should use multipart form data not json. Dont worry, the file will not
  nulled on server, our api know how to save partial update.
    json api format
    {
      data: {
        attributes: {
          name: 'bla',
          file: 'url-to-file'
        }
      }
    }
  */
  serializeIntoHash(hash, type, record, options) {
    let serialized = this.serialize(record, options);
    if (serialized.data && serialized.data.attributes && serialized.data.attributes.file) {
      delete serialized.data.attributes.file;
    }
    merge(hash, serialized);
  }
});
