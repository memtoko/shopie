import Ember from 'ember';

export default Ember.Mixin.create({
  selectOnClick: false,
  stopEnterKeyDownPropagation: false,

  click(event) {
    if (this.get('selectOnClick')) {
      event.currentTarget.select();
    }
  },

  keyDown(event) {
    if (this.get('stopEnterKeyDownPropagation') && event.keyCode === 13) {
      event.stopPropagation();

      return true;
    }
  }
});
