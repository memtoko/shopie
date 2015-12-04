import Ember from 'ember';
import HTML5FileMixin from '../mixins/html5-file';
let { $ } = Ember;

export default Ember.TextField.extend(HTML5FileMixin, {
  type: 'file',
  attributeBindings: ['multiple'],
  multiple: false,
  resetInput: false,

  change(event) {
    let input = event.target;
    if (!Ember.isEmpty((input.files))) {
      if (!this.attrs.change) {
        throw new Error(`You must provide an \`change\` action to \`{{${this.templateName}}}\`.`);
        this.getFilesInput($(input)).then((files) => {
          console.log(files);
          let action = this.attrs['change'];
          action(files);
        });
      }
    }
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
