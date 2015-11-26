import Ember from 'ember';
import InfiniteScrollMixin from '../mixins/infinite-scroll';

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

export default Ember.Component.extend(InfiniteScrollMixin, {

  didRender() {
    this._super(...arguments);
    let elem = this.$();

    elem.on('scroll', Ember.run(elem, setScrollClass, {
      target: elem.closest('.content-list'),
      offset: 10
    }));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().off('scroll');
  }
});
