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
  })
});
