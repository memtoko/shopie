import Ember from 'ember';
import DropdownMixin from '../mixins/dropdown-mixin';

const ANIMATIONEVENT = 'animationend webkitAnimationEnd oanimationend MSAnimationEnd';

export default Ember.Component.extend(DropdownMixin, {
  classNames: 'dropdown',
  classNameBindings: ['fadeIn:fade-in-scale:fade-out', 'isOpen:open:closed'],
  name: null,
  closeOnClick: false,

  // Helps track the user re-opening the menu while it's fading out.
  closing: false,

  // Helps track whether the dropdown is open or closes, or in a transition to either
  isOpen: false,

  fadeIn: Ember.computed('isOpen', 'closing', function () {
    return this.get('isOpen') && !this.get('closing');
  }),

  dropdown: Ember.inject.service(),

  open() {
    this.set('isOpen', true);
    this.set('closing', false);
    this.set('button.isOpen', true);
  },

  close() {
    this.set('closing', true);
    if (this.get('button')) {
      this.set('button.isOpen', false);
    }

    this.$().on(ANIMATIONEVENT, (event) => {
      if (event.originalEvent.animationName === 'fade-out') {
        Ember.run(this, () => {
          if (this.get('closing')) {
            this.set('isOpen', false);
            this.set('closing', false);
          }
        });
      }
    });
  },

  toggle(options) {
    var isClosing = this.get('closing'),
      isOpen = this.get('isOpen'),
      name = this.get('name'),
      button = this.get('button'),
      targetDropdownName = options.target;

    if (name === targetDropdownName && (!isOpen || isClosing)) {
      if (!button) {
        button = options.button;
        this.set('button', button);
      }
      this.open();
    } else if (isOpen) {
      this.close();
    }
  },

  click(event) {
    this._super(event);

    if (this.get('closeOnClick')) {
      return this.close();
    }
  },

  didInsertElement() {
    this._super(...arguments);

    let dropdownService = this.get('dropdown');

    dropdownService.on('close', this, this.close);
    dropdownService.on('toggle', this, this.toggle);
  },

  willDestroyElement() {
    this._super(...arguments);

    let dropdownService = this.get('dropdown');

    dropdownService.off('close', this, this.close);
    dropdownService.off('toggle', this, this.toggle);
  }
});
