import Ember from 'ember';
import InfiniteScrollMixin from '../mixins/infinite-scroll';
import setScrollClass from '../utils/set-scroll-class';

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
