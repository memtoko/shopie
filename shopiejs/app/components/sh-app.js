import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['sh-app'],
  showSettingsMenu: false,

  toggleSettingsMenuBodyClass: Ember.observer('showSettingsMenu', function () {
    let showSettingsMenu = this.get('showSettingsMenu');
    Ember.run.once(this, function () {
      Ember.$('body').toggleClass('settings-menu-expanded', showSettingsMenu);
    });
  })
});
