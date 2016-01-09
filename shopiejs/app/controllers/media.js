import Ember from 'ember';

let { $, RSVP } = Ember;

export default Ember.Controller.extend({
  shopiePaths: Ember.inject.service('shopie-paths'),
  notifications: Ember.inject.service(),
  session: Ember.inject.service(),

  resetInput: false,
  multiple: true,

  stateklass: '',
  submitting: false,

  mobileWidth: 600,
  isMobile: false,

  progressValue: 0,

  mediaContentFocused: Ember.computed.equal('keyboardFocus', 'mediaContent'),
  mediaListFocused: Ember.computed.equal('keyboardFocus', 'mediaList'),

  // sort the model, so newer model on top
  media: Ember.computed.sort('model', function (a, b) {
    var idA = +a.get('id'),
      idB = +b.get('id');

    if (idA > idB) {
      return 1;
    } else if (idA < idB) {
      return -1;
    }

    return 0;
  }),

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

    let progressHandler = (e) => this._progressHandler(e);
    // we have our data now, lets submit it to server
    return ajax.post(this.get('shopiePaths.url').api('media'), {
      data: formData,
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      headers: {
        'accept': 'application/vnd.api+json'
      },
      xhr: function () {
        let xhrRequest = $.ajaxSettings.xhr();
        if (xhrRequest.upload) {
          xhrRequest.upload.addEventListener(
            'progress', progressHandler, false
          );
        }
        return xhrRequest;
      }
    }).catch((err) => {
      let name = file.name || file.fileName;
      notifications.showAlert(`Upload Failed for file ${name}`, {
        type: 'error',
        key: 'upload.failed'
      });
    });
  },

  _progressHandler(e) {
    if (e.lengthComputable) {
      let completedPercent = (e.loaded / e.total) * 100;
      this.set('progressValue', completedPercent);
    }
  },

  uploadFiles(files) {
    var submitting = this.get('submitting'),
      notifications = this.get('notifications'),
      store = this.get('store');
    // we are busy
    if (submitting !== false) {
      return;
    }

    this.set('progressValue', 0);

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
      this.set('progressValue', 0);
    });
  },

  actions: {
    fileChange(files) {
      this.toggleProperty('resetInput');
      this.uploadFiles(files).then(() => {
        this.toggleProperty('resetInput');
      });
    },

    onDrop(files) {
      this.uploadFiles(files);
    }
  }
});
