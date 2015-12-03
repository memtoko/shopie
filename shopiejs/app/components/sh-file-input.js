import Ember from 'ember';

export default Ember.TextField.extend({
  type: 'file',
  attributeBindings: ['multiple'],
  multiple: false,
  resetInput: false,

  change(event) {
    let input = event.target;
    if (!Ember.isEmpty((input.files))) {
      if (!this.attrs.change) {
        throw new Error(`You must provide an \`change\` action to \`{{${this.templateName}}}\`.`);
        let action = this.attrs['change'];
        action(input.files);
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
