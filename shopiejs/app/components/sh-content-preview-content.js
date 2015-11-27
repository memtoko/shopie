import Ember from 'ember';

let setScrollClass = function (options) {
  var $target = options.target || this,
    offset = options.offset,
    className = options.className || 'scrolling';

  if (this.scrollTop() > offset) {
    $target.addClass(className);
  } else {
    $target.removeClass(className);
  }
};

export default Ember.Component.extend({
  classNames: ['content-preview-content'],

  content: null,

  didInsertElement() {
    let el = this.$();
    el.on('scroll', Ember.run.bind(el, setScrollClassName, {
      target: el.closest('.content-preview'),
      offset: 10
    }));
  },

  didReceiveAttrs(options) {
    if (options.newAttrs.content &&
      this.get('content') !== options.newAttrs.content.value) {
      let el = this.$();
      if (el) {
        el.closest('.content-preview').scrollTop(0);
      }
    }
  },

  willDestroyElement() {
    let el = this.$();
    el.off('scroll');
  }
});
