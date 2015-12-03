import Ember from 'ember';

export default Ember.Controller.extend({
  media: Ember.computed.alias('model'),
  shopiePaths: Ember.inject.service('shopie-paths'),
  notifications: Ember.inject.service(),
  session: Ember.inject.service(),

  resetInput: false,
  multiple: true,

  actions: {
    fileChange(files) {
      console.log(files);
    },

    onDragOver(files) {
      console.log(files);
    }
  }
});
