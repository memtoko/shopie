import Ember from 'ember';

export default Ember.Component.extend({

  _file: null,

  uploadButtonText: 'Text',

  uploadButtonDisabled: true,

  onUpload: null,
  onAdd: null,

  shouldResetForm: true,

  change(event) {
    this.set('uploadButtonDisabled', false);
    let reader = new FileReader();
    reader.onload = (e) => {
      let file = e.target.result;
      Ember.run(() => {
        this.set('_file', file);
      });
    };
    this.sendAction('onAdd');

    reader.readAsDataURL(event.target.files[0]);
  },

  actions: {
    upload() {
      if (!this.get('uploadButtonDisabled') && this._file) {
        this.sendAction('onUpload', this._file);
      }

      this.set('uploadButtonDisabled', true);

      // Reset form
      if (this.get('shouldResetForm')) {
        this.$().closest('form').get(0).reset();
      }
    }
  }
});
