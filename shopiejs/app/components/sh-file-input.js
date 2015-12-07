import Ember from 'ember';
import HTML5FileMixin from '../mixins/html5-file';

export default Ember.TextField.extend(HTML5FileMixin, {
  type: 'file',
  attributeBindings: ['multiple'],
  multiple: false,
  resetInput: false,

  change(event) {
    let input = event.target;
    if (!this.attrs.onAdd) {
      throw new Error(`You must provide an \`onAdd\` action to \`{{${this.templateName}}}\`.`);
    }
    this.getFilesInput(input).then((files) => {
      let action = this.attrs['onAdd'];
      action(files);
    });
  },

  _resetObserver: Ember.observer('resetInput', function () {
    let reset = this.get('resetInput');
    if (reset) {
      Ember.run(this, () => {
        this.$().closest('form').get(0).reset();
      });
    }
  })
});
