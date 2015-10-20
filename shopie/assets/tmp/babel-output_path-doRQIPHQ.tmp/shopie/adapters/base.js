import DS from 'ember-data';
import shopiePaths from 'shopie/utils/shopie-paths';

export default DS.JSONAPIAdapter.extend({
    host: window.location.origin,
    namespace: shopiePaths().apiRoot.slice(1),

    query: function query(store, type, _query) {
        var id = undefined;

        if (_query.id) {
            id = _query.id;
            delete _query.id;
        }

        return this.ajax(this.buildURL(type.modelName, id), 'GET', { data: _query });
    },

    buildURL: function buildURL(type, id) {
        // Ensure trailing slashes
        var url = this._super(type, id);

        if (url.slice(-1) !== '/') {
            url += '/';
        }

        return url;
    }
});