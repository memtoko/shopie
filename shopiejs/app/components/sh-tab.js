import Ember from 'ember';

let { computed } = Ember;

export default Ember.Component.extend({
  tabContainer: computed(function () {
    return this.nearestWithProperty('isTabContainer');
  }),

  active: computed('tabContainer.activeTab', function () {
    this.get('tabContainer.activeTab') === this;
  }),

  index: computed('tabContainer.tabs.[]', function () {
    return this.get('tabContainer.tabs').indexOf(this);
  }),

  click() {
    this.get('tabContainer').select(this);
  },

  willRender() {
    this.get('tabContainer').registerTab(this);
  },

  willDestroyElement() {
    this.get('tabContainer').unregisterTab(this);
  }
});
