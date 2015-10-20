import Ember from 'ember';

export default Ember.Mixin.create({

    model: null,

    serialize: function serialize(model, params) {
        return { product_id: model.get('slug') + '-' + model.get('id') };
    }
});