import Ember from 'ember';

// configure keymaster to respond all shortcuts
key.filter = () => true

key.setScope('default');

let _keys = Object.keys || Ember.keys;

export default Ember.Mixin.create({

  registerShortcuts() {
    let shortcuts = this.get('shortcuts');

    _keys(shortcuts).forEach((shortcut) => {
      var scope = shortcuts[shortcut].scope || 'default',
        action = shortcuts[shortcut],
        options;

      if (Ember.typeOf(action) !== 'string') {
        options = action.options;
        action = action.action;
      }

      key(shortcut, scope, (event) => {
        // prevent default action, as we likely to override
        event.preventDefault();
        Ember.run(this, () => {
          this.send(action, options);
        });
      });
    });
  },

  removeShortcuts() {
    let shortcuts = this.get('shortcuts');

    _keys(shortcuts).forEach((shortcut) => {
      var scope = shortcuts[shortcut].scope || 'default';
      key.unbind(shortcut, scope);
    });
  },

  activate() {
    this._super(...arguments);
    this.registerShortcuts();
  },

  deactivate() {
    this._super(...arguments);
    this.removeShortcuts();
  }
});
