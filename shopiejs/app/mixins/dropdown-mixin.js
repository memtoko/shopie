import Ember from 'ember';

export default Ember.Mixin.create(Ember.Evented, {
  classNameBindings: ['isOpen:open:closed'],
  isOpen: false,

  click(event) {
    this._super(event);

    return event.stopPropagation();
  }
});
