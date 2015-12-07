import Ember from 'ember';

let { computed } = Ember;

export default Ember.Component.extend({
  classNameBindings: ['active'],

  tabContainer: computed(function () {
    return this.nearestWithProperty('isTabContainer');
  }),

  tab: computed('tabContainer.tabs.[]', 'tabContainer.tabPanes.[]', function () {
    var index = this.get('tabContainer.tabPanes').indexOf(this),
      tabs = this.get('tabContainer.tabs');

    return tabs && tabs.objectAt(index);
  }),

  active: computed.alias('tab.active'),

  willRender() {
    this.get('tabContainer').registerTabPane(this);
  },

  willDestroyElement() {
    this.get('tabContainer').unregisterTabPane(this);
  }
});
