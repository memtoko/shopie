import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['sh-dropzone', 'js-dropzone'],

  didInsertElement() {
    var elem = this.$();

    elem.on('dragover', (e) => this._handleDragOver(e));
    elem.on('dragover dragenter', () => {
      elem.addClass('is-dragover');
    });
    elem.on('dragleave dragend drop', () => {
      elem.removeClass('is-dragover');
    });
    elem.on('drop', (e) => this._handledrop(e));
  },

  willDestroyElement() {
    var elem = this.$();
    elem.off('dragover dragenter dragleave dragend drop');
  },

  _handledrop(e) {
    e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
    var dataTransfer = e.dataTransfer;
    if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
      e.preventDefault();
      this.sendAction('onDrop', dataTransfer.files)
    }
  },

  _handleDragOver(e) {
    e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
    var dataTransfer = e.dataTransfer;
    if (dataTransfer && $.inArray('Files', dataTransfer.types) !== -1) {
      e.preventDefault();
      dataTransfer.dropEffect = 'copy';
    }
  }
});
