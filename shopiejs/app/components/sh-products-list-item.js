import Ember from 'ember';

let { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['active'],

  product: null,
  active: false,
  previewIsHidden: false,

  authorName: computed('product.user.username', 'product.user.email', function () {
    return this.get('product.author.username') || this.get('product.author.email');
  }),

  viewOrEdit: computed('previewIsHidden', function () {
    return this.get('previewIsHidden') ? 'editor.edit' : 'products.product';
  }),

  click() {
    this.sendAction('onClick', this.get('product'));
  },

  doubleClick() {
    this.sendAction('onDoubleClick', this.get('product'));
  },

  didInsertElement() {
    this.addObserver('active', this, this.scrollIntoView);
  },

  willDestroyElement() {
    this.removeObserver('active', this, this.scrollIntoView);
  },

  scrollIntoView() {
    if (!this.get('active')) {
      return;
    }
    var element = this.$(),
      offset = element.offset().top,
      elementHeight = element.height(),
      container = Ember.$('.js-content-scrollbox'),
      containerHeight = container.height(),
      currentScroll = container.scrollTop(),
      isBelowTop,
      isAboveBottom,
      isOnScreen;

    isAboveBottom = offset < containerHeight;
    isBelowTop = offset > elementHeight;

    isOnScreen = isBelowTop && isAboveBottom;

    if (!isOnScreen) {
      // Scroll so that element is centered in container
      // 40 is the amount of padding on the container
      container.clearQueue().animate({
          scrollTop: currentScroll + offset - 40 - containerHeight / 2
      });
    }
  }
});

