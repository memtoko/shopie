import Ember from 'ember';

const ANIMATIONEVENT = 'animationend webkitAnimationEnd oanimationend MSAnimationEnd';
const EMPTYSTRING = ' ';

let { computed } = Ember;

export default Ember.Component.extend({

  didInsertElement() {
    this.$('.js-modal-container, .js-modal-background').addClass('fade-in open');
    this.$('.js-modal').addClass('open');
  },

  close() {
    this.$('.js-modal, .js-modal-background').removeClass('fade-in').addClass('fade-out');
    this.$('.js-modal-background').on(ANIMATIONEVENT, (event) => {
      if (event.originalEvent.animationName === 'fade-out') {
        this.$('.js-modal, .js-modal-background').removeClass('open');
      }
    });

    this.sendAction();
  },

  _handleAction(promise) {
    promise.finally(() => {
      this.close();
    });
  },

  klass: computed('type', 'style', function () {
    let classNames = [];
    classNames.push(this.get('type') ? `modal-${this.get('type')}` : 'modal');
    if (this.get('style')) {
      this.get('style').split(',').forEach((kls) => {
        classNames.push(`modal-${kls}`);
      });
    }

    return classNames.join(EMPTYSTRING);
  }),

  acceptButtonClass: computed('confirm.accept.buttonClass', function () {
    var _ref;
    return (_ref = this.get('confirm.accept.buttonClass')) ? _ref : 'btn btn-green';
  }),

  rejectButtonClass: computed('confirm.reject.buttonClass', function () {
    var _ref;
    return (_ref = this.get('confirm.reject.buttonClass')) ? _ref : 'btn btn-red';
  }),

  actions: {

    closeModal() {
      this.close();
    },

    confirmAccept() {
      return this._handleAction(this.attrs.confirmAccept());
    },

    confirmReject() {
      return this._handleAction(this.attrs.confirmReject());
    },

    noBubble: Ember.K
  }
});
