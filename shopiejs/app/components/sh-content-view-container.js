import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['sh-view', 'content-view-container'],

  previewIsHidden: false,

  resizeService: Ember.inject.service(),

  _resizeListener: null,

  calculatePreviewIsHidden() {
    if (this.$('.content-preview').length) {
      this.set('previewIsHidden', !this.$('.content-preview').is(':visible'));
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._resizeListener = Ember.run.bind(this, this.calculatePreviewIsHidden);
    this.get('resizeService').on('debouncedDidResize', this._resizeListener);
    this.calculatePreviewIsHidden();
  },

  willDestroy() {
    this.get('resizeService').off('debouncedDidResize', this._resizeListener);
  }

});
