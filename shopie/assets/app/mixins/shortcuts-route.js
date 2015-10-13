import Ember from 'ember';
/* global key */
key.filter = () => true;

key.setScope('default');

let ShortcutsRoute = Ember.Mixin.create({
    registerShortcuts: function() {
        let shortcuts = this.get('shortcuts');

        Ember.keys(shortcuts).forEach((shortcut) => this.addShortcut(shortcut));
    },

    addShortcut: function(shortcut) {
        let shortcuts = this.get('shortcuts'),
            scope = shortcuts[shortcut].scope || 'default',
            action = shortcuts[shortcut],
            options;
        if (Ember.typeOf(action) !== 'string') {
            options = action.options;
            action = action.action;
        }

        key(shortcut, scope, function (event) {
            // stop things like ctrl+s from actually opening a save dialogue
            event.preventDefault();
            this.send(action, options);
        }.bind(this));
    },

    removeShortcuts: function() {
        let shortcuts = this.get('shortcuts');

        Ember.keys(shortcuts).forEach((shortcut) => key.unbind(shortcut));
    },

    activate: function () {
        this._super();
        this.registerShortcuts();
    },

    deactivate: function () {
        this._super();
        this.removeShortcuts();
    }
});

export default ShortcutsRoute;
