define('shopie/models/product', ['exports', 'ember-data'], function (exports, DS) {

    'use strict';

    exports['default'] = DS['default'].Model.extend({
        name: DS['default'].attr('string'),
        slug: DS['default'].attr('string'),
        metaDescription: DS['default'].attr('string'),
        shortDescription: DS['default'].attr('string'),
        description: DS['default'].attr('string'),
        image: DS['default'].attr('string'),
        thumbnail: DS['default'].attr('string'),
        unitPrice: DS['default'].attr('string'),
        isActive: DS['default'].attr('boolean'),
        productType: DS['default'].attr(),
        parent: DS['default'].belongsTo('product', { inverse: 'variants' }),
        variants: DS['default'].hasMany('product', { inverse: 'parent' }),
        author: DS['default'].belongsTo('user', { async: true }),

        formatSlug: (function () {
            return this.get('slug') + '-' + this.get('id');
        }).property('slug', 'id')
    });

});