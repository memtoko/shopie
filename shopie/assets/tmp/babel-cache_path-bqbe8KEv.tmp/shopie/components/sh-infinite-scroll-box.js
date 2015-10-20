import Ember from 'ember';
import InfiniteScrollMixin from 'shopie/mixins/infinite-scroll';
import setScrollClassName from 'shopie/utils/set-scroll-classname';

export default Ember.Component.extend(InfiniteScrollMixin, {
    didRender: function didRender() {
        this._super();

        var el = this.$();

        el.on('scroll', Ember.run.bind(el, setScrollClassName, {
            target: el.closest('.content-list'),
            offset: 10
        }));
    },

    willDestroyElement: function willDestroyElement() {
        this._super();

        this.$().off('scroll');
    }
});