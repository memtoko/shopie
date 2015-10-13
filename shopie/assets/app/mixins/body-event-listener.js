import Ember from 'ember';
/* global $ */
export default Ember.Mixin.create({
    bodyElementSelector: 'html',
    bodyClick: Ember.K,

    init: function() {
        this._super();

        return Ember.run.next(this, this._setupDocumentHandlers);
    },

    willDestroy: function() {
        this._super();

        return this._removeDocumentHandlers();
    },

    _setupDocumentHandlers: function() {
        if (this._clickHandler) {
            return;
        }

        this._clickHandler = () => this.bodyClick;

        return $(this.get('bodyElementSelector')).on('click', this._clickHandler);
    },

    _removeDocumentHandlers: function() {
        $(this.get('bodyElementSelector')).off('click', this._clickHandler);
        this._clickHandler = null;
    },

    click: (event) => event.stopPropagation()
});
