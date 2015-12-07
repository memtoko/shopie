import Ember from 'ember';
import { boundOneWay } from 'shopie/utils/computed';

const {get} = Ember;

export default Ember.Component.extend({
  //the medium model
  medium: null,
  isMobile: false,
  saving: false,
  name: '',
  description: '',

  //
  scratchDescription: boundOneWay('medium.description'),

  didReceiveAttrs(attrs) {
    if (get(attrs, 'newAttrs.medium.value.id') !== get(attrs, 'oldAttrs.medium.value.id')) {
      this.reset();
    }
  },

  reset() {
    if (this.$()) {
      this.$('.media-menu-pane').scrollTop(0);
    }
  },

  title: Ember.computed('medium.isNew', function () {
    if (this.get('medium.isNew')) {
      return 'New Media';
    } else {
      return 'Edit Media';
    }
  }),

  actions: {

    updateName(value) {
      this.name = value;
    },

    updateDescription(value) {
      this.description = value;
    },

    saveMedium() {
      this.attrs.saveMedium({
        name: this.name,
        description: this.description
      });
    },

    deleteMedium() {
      this.attrs.deleteMedium();
    }
  }
});
