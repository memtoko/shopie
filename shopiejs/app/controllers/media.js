import Ember from 'ember';

let { $, RSVP } = Ember;

export default Ember.Controller.extend({
  media: Ember.computed.alias('model'),
  shopiePaths: Ember.inject.service('shopie-paths'),
  notifications: Ember.inject.service(),
  session: Ember.inject.service(),

  resetInput: false,
  multiple: true,

  stateklass: '',
  submitting: false,

  uploadFile(file, user) {
    if (!file || !user) {
      return RSVP.reject();
    }
    var formData = new FormData(),
      notifications = this.get('notifications'),
      ajax = this.get('ajax'),
      userObject = {
        'type': 'users',
        'id': user.get('id')
      };
    formData.append('file', file);
    formData.append('user', JSON.stringify(userObject));
    // we have our data now, lets submit it to server
    return ajax.post(this.get('shopiePaths.url').api('media'), {
      data: formData,
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      headers: {
        'accept': 'application/vnd.api+json'
      }
    }).catch((err) => {
      let name = file.name || file.fileName;
      notifications.showAlert(`Upload Failed for file ${name}`, {
        type: 'error',
        key: 'upload.failed'
      });
    });
  },

  uploadFiles(files) {
    var submitting = this.get('submitting'),
      notifications = this.get('notifications'),
      store = this.get('store');
    // we are busy
    if (submitting !== false) {
      return;
    }
    this.toggleProperty('submitting');
    this.set('stateklass', 'is-uploading');
    // get the current user first, to know who is doing this
    return this.get('session.user').then((user) => {
      // map all files to Promise, to make sure this operation
      // they are all parallel (upload)
      return files.map((file) => this.uploadFile(file, user))
        .reduce((sequence, uploadPromise) => {
          return sequence.then(() => uploadPromise).then((payload) => {
            // when this promise resolved push it store, so user can see
            // it
            store.pushPayload('medium', payload);
          });
        }, RSVP.resolve());
    }).catch((err) => {
      this.set('stateklass', 'is-uploading-error');
    }).then((err) => {
      this.set('stateklass', 'is-uploading-success');
    }).finally(() => {
      // reset
      this.toggleProperty('submitting');
      this.set('stateklass', '');
    });
  },

  actions: {
    fileChange(files) {
      this.uploadFiles($.makeArray(files));
    },

    onDrop(files) {
      this.uploadFiles($.makeArray(files));
    }
  }
});
