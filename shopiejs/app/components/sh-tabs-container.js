import Ember from 'ember';

export default Ember.Component.extend({
  activeTab: null,
  tabs: Ember.A(),
  tabPanes: Ember.A(),

  isTabContainer: true,

  select(tab) {
    this.set('activeTab', tab);
    this.sendAction('selected');
  },

  registerTab(tab) {
    this.get('tabs').addObject(tab);
  },

  unregisterTab(tab) {
    this.get('tabs').removeObject(tab);
  },

  registerTabPane(pane) {
    this.get('tabPanes').addObject(pane);
  },

  unregisterTabPane(pane) {
    this.get('tabPanes').removeObject(pane);
  }
});
