import Ember from 'ember';
/* global key */
key.filter = function () {
    return true;
};

key.setScope('default');

var ShortcutsRoute = Ember.Mixin.create({
    registerShortcuts: function registerShortcuts() {
        var _this = this;

        var shortcuts = this.get('shortcuts');

        Object.keys(shortcuts).forEach(function (shortcut) {
            return _this.addShortcut(shortcut);
        });
    },

    addShortcut: function addShortcut(shortcut) {
        var _this2 = this;

        var shortcuts = this.get('shortcuts'),
            scope = shortcuts[shortcut].scope || 'default',
            action = shortcuts[shortcut],
            options = undefined;
        if (Ember.typeOf(action) !== 'string') {
            options = action.options;
            action = action.action;
        }

        key(shortcut, scope, function (event) {
            // stop things like ctrl+s from actually opening a save dialogue
            event.preventDefault();
            _this2.send(action, options);
        });
    },

    removeShortcuts: function removeShortcuts() {
        var shortcuts = this.get('shortcuts');

        Object.keys(shortcuts).forEach(function (shortcut) {
            return key.unbind(shortcut);
        });
    },

    activate: function activate() {
        this._super();
        this.registerShortcuts();
    },

    deactivate: function deactivate() {
        this._super();
        this.removeShortcuts();
    }
});

export default ShortcutsRoute;