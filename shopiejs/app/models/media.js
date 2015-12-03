import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  description: DS.attr(),
  slug: DS.attr(),
  file: DS.attr('file'),
  owner: DS.belongsTo('user', {
    async: true
  })
});
