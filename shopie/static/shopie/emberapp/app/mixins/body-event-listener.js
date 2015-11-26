import Ember from 'ember';

let { run } = Ember;

export default Ember.Mixin.create({
  bodyElementSelector: 'html',
  bodyClick: Ember.K,

  init() {
    this._super(...arguments);

    run.next(this, this._setupDocumentHandlers);
  },

  willDestroy() {
    this._super(...arguments);
    this._removeDocumentHandlers();
  },

  _setupDocumentHandlers() {
    if (! this._clickHandler) {
      this._clickHandler = () => this.bodyClick()

      return $(this.get('bodyElementSelector')).on('click', this._clickHandler);
    }
  },

  _removeDocumentHandlers() {
    $(this.get('bodyElementSelector')).off('click', this._clickHandler);
    this._clickHandler = null;
  },

  click(envent) {
    return event.stopPropagation();
  }
});
