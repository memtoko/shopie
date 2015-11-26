import Ember from 'ember';
import BodyEventListener from '../mixins/body-event-listener';

export default Ember.Service.extend(Ember.Evented, BodyEventListener, {

  bodyClick(event) {
    /*jshint unused:false */
    this.closeDropdowns();
  },

  closeDropdowns() {
    this.trigger('close');
  },

  toggleDropdown(dropdownName, dropdownButton) {
    this.trigger('toggle', {target: dropdownName, button: dropdownButton});
  }
});
