import Ember from 'ember';

export default Ember.Component.extend({
  dateTime: null,

  timeago: Ember.computed('dateTime', function () {
    let dateTime = this.get('dateTime');
    return moment(dateTime).fromNow();
  })
});
