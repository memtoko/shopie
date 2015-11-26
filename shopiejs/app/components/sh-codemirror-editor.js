import Ember from 'ember';

const { run } = Ember;

export default Ember.Component.extend({
  classNameBindings: ['isFocused:focused'],
  isFocused: false,

  value: '',
  editor: null,

  lineNumbers: true,
  indentUnit: 4,
  mode: 'htmlmixed',
  theme: 'xq-light',

  didInsertElement() {
    let options = this.getProperties('lineNumbers', 'indentUnit', 'mode', 'theme');
    let editor = new CodeMirror(this.get('element'), options);

    editor.getDoc().setValue(this.get('value'));

    editor.on('focus', run.bind(this, 'set', 'isFocused', true));
    editor.on('blur', run.bind(this, 'set', 'isFocused', false));

    editor.on('change', () => {
      run(this, () => {
        this.set('value', editor.getDoc().getValue());
      });
    });
    this.set('editor', editor);
  },

  willDestroyElement() {
    let editor = this.get('editor').getWrapperElement();
    editor.parentNode.removeChild(editor);
    this.set('editor', null);
  }
});
