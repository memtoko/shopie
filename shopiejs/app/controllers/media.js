import Ember from 'ember';

export default Ember.Controller.extend({
  uploadButtonText: 'Upload',
  uploadErrors: '',

  submitting: false,

  notifications: Ember.inject.service(),
  session: Ember.inject.service(),

  actions: {
    onUpload(file) {
      console.log(file);
      let media = this.store.createRecord('media', {
        file: file,
        name: file.name ? file.name : ''
      });
      this.get('session.user').then(function (user) {
        media.set('owner', user);
        //let see that work or not
        return media.save();
      }).catch((err) => {
        console.log(err);
      });
    }
  }
});
