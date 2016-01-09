import Ember from 'ember';

export default Ember.Controller.extend({
  uploadButtonText: 'Upload',
  uploadError: '',
  submitting: false,
  shopiePaths: Ember.inject.service('shopie-paths'),
  notifications: Ember.inject.service(),
  session: Ember.inject.service(),
  _file: null,
  displayUploadButton: false,

  confirm: {
    accept: {
      text: 'Upload'
    },
    reject: {
      text: 'cancel'
    }
  },

  actions: {

    onAddFile(file) {
      this.set('_file', file);
    },

    uploadFile() {
      var formData = new FormData(),
        notifications = this.get('notifications'),
        file = this.get('_file'),
        submitting = this.get('submitting');

      if (submitting) {
        return Ember.RSVP.reject();
      }
      if (!file) {
        return new Ember.RSVP.Promise((resolve, reject) => {
          notifications.showAlert('Please select a file. :)', {
            type: 'error',
            key: 'upload.failed'
          });
          reject();
        });
      }
      this.set('uploadButtonText', 'Uploading');
      this.set('importErrors', '');
      this.toggleProperty('submitting');
      formData.append('file', file);
      return this.get('session.user').then((user) => {
        let userObject = {
          'type': 'users',
          'id': user.get('id')
        };
        formData.append('user', JSON.stringify(userObject));
        return formData;
      }).then((data) => {
        return this.ajax.post(this.get('shopiePaths.url').api('media'), {
          data: data,
          dataType: 'json',
          cache: false,
          contentType: false,
          processData: false,
          headers: {
            'accept': 'application/vnd.api+json'
          }
        });
      }).then((payload) => {
        notifications.showNotification('upload successful.');
        return this.store.pushPayload('medium', payload);
      }).catch((err) => {
        notifications.showAlert('Upload Failed', {type: 'error', key: 'upload.failed'});
      }).then(() => {
        this.set('uploadButtonText', 'Upload');
        this.set('_file', null);
        this.toggleProperty('submitting');
      });
    },

    cancelUpload() {
      return Ember.RSVP.reject();
    }
  }
});
