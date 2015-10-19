import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    slug: DS.attr('string'),
    metaDescription: DS.attr('string'),
    shortDescription: DS.attr('string'),
    description: DS.attr('string'),
    image: DS.attr('string'),
    thumbnail: DS.attr('string'),
    unitPrice: DS.attr('string'),
    isActive: DS.attr('boolean'),
    productType: DS.attr(),
    parent: DS.belongsTo('product', {inverse: 'variants'}),
    variants: DS.hasMany('product', {inverse: 'parent'}),
    author: DS.belongsTo('user'),

    formatSlug: function() {
        return this.get('slug') + '-' + this.get('id');
    }.property('slug', 'id')
});
