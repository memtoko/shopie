import Ember from 'ember';

let {computed, inject} = Ember;
let {alias} = computed;

export default Ember.Controller.extend({
  medium: alias('model'),
  isMobile: alias('mediaController.isMobile'),

  mediaController: inject.controller('media'),
  notifications: inject.service(),

  actions: {

    saveMedium(properties) {
      let medium = this.get('medium');
      medium.setProperties(properties);
      if (medium.get('hasDirtyAttributes')) {
        medium.save();
      }
    },

    deleteMedium() {
      this.sendAction('openModal', 'delete-medium', this.get('medium'));
    }
  }
});
