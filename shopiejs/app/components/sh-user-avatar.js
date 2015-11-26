import Ember from 'ember';

export default Ember.Component.extend({
  size: 200,
  email: '',

  avatarUrl: Ember.computed('email', 'size', function() {
    var size = this.get('size'),
      email = window.md5(this.get('email'));

    return `//www.gravatar.com/avatar/${emailHash}?s=${size}`;
  })
});
