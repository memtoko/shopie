import Ember from 'ember';

export default Ember.Component.extend({
  dateTime: null,
  _nextTick: false,
  //tick update on minute
  tick: 1,

  didInsertElement() {
    let tick = this.get('tick') * 60000;
    this.set('_nextTick', Ember.run.later(this, this._updateTimer, tick));
  },

  timeago: Ember.computed('dateTime', function () {
    let dateTime = this.get('dateTime');
    return moment(dateTime).fromNow();
  }),

  _updateTimer() {
    this.notifyPropertyChange('dateTime');
    let tick = this.get('tick') * 60000;
    this.set('_nextTick', Ember.run.later(this, this._updateTimer, tick));
  },

  willDestroyElement() {
    let nextTick = this.get('_nextTick');
    Ember.run.cancel(nextTick);
  }
});
