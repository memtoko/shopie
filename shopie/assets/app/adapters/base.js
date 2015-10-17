import DS from 'ember-data';
import shopiePaths from 'shopie/utils/shopie-paths';

export default DS.JSONAPIAdapter.extend({
    host: window.location.origin,
    namespace: shopiePaths().apiRoot.slice(1),

    query: function (store, type, query) {
        let id;

        if (query.id) {
            id = query.id;
            delete query.id;
        }

        return this.ajax(this.buildURL(type.modelName, id), 'GET', {data: query});
    },

    buildURL: function (type, id) {
        // Ensure trailing slashes
        var url = this._super(type, id);

        if (url.slice(-1) !== '/') {
            url += '/';
        }

        return url;
    }
});
