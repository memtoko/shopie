import Ember from 'ember';

let { $, run } = Ember;

export default Ember.Mixin.create({

  activate() {
    this._super(...arguments);
    let cssClasses = this.get('classNames');
    if (cssClasses) {
      run.schedule('afterRender', null, () => {
        cssClasses.forEach(function (curClass) {
          $('body').addClass(curClass);
        });
      });
    }
  },

  deactivate() {
    this._super(...arguments);
    let cssClasses = this.get('classNames');
    if (cssClasses) {
      run.schedule('afterRender', null, () => {
        cssClasses.forEach(function (curClass) {
          $('body').removeClass(curClass);
        });
      });
    }
  }
});
