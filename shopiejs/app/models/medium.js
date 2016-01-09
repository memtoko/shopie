import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  file: DS.attr(),
  user: DS.belongsTo('user', {
    async: true
  }),
  isPublic: DS.attr(),

  isImage: Ember.computed('file', function () {
    let file = this.get('file');
    return(file.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }),

  userName: Ember.computed('user.username', 'user.email', function () {
    var username = this.get('user.username'),
      email = this.get('user.email');

    return username ? username : email;
  })
});
