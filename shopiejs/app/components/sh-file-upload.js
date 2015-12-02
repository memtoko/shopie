import Ember from 'ember';

export default Ember.Component.extend({
  _file: null,
  uploadButtonText: 'upload',
  uploadButtonDisabled: true,

  onUpload: null,
  onAdd: null,
  displayUploadButton: true,
  shouldResetForm: true,

  willDestroyElement() {
    this.$().closest('form').get(0).reset();
  },

  change(event) {
    this.set('uploadButtonDisabled', false);
    this._file = event.target.files[0];
    this.sendAction('onAdd', this._file);
  },

  actions: {

    upload() {
      if (!this.get('uploadButtonDisabled') && this._file) {
        this.sendAction('onUpload', this._file);
      }

      // Prevent double post by disabling the button.
      this.set('uploadButtonDisabled', true);

      // Reset form
      if (this.get('shouldResetForm')) {
        this.$().closest('form').get(0).reset();
      }
    }
  }
});
