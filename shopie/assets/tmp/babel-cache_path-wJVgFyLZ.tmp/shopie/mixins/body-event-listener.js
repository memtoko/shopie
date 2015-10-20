import Ember from 'ember';
/* global $ */
export default Ember.Mixin.create({
    bodyElementSelector: 'html',
    bodyClick: Ember.K,

    init: function init() {
        this._super();

        return Ember.run.next(this, this._setupDocumentHandlers);
    },

    willDestroy: function willDestroy() {
        this._super();

        return this._removeDocumentHandlers();
    },

    _setupDocumentHandlers: function _setupDocumentHandlers() {
        var _this = this;

        if (this._clickHandler) {
            return;
        }

        this._clickHandler = function () {
            return _this.bodyClick;
        };

        return $(this.get('bodyElementSelector')).on('click', this._clickHandler);
    },

    _removeDocumentHandlers: function _removeDocumentHandlers() {
        $(this.get('bodyElementSelector')).off('click', this._clickHandler);
        this._clickHandler = null;
    },

    click: function click(event) {
        return event.stopPropagation();
    }
});