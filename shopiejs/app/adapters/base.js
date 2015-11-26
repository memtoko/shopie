import DS from 'ember-data';
import shopiePaths from '../utils/shopie-paths';

export default DS.JSONAPIAdapter.extend({
  host: window.location.origin,
  namespace: shopiePaths().apiRoot.slice(1),

  query(store, type, query) {
    let id;
    if (query.id) {
      id = query.id;
      delete query.id;
    }
    return this.ajax(this.buildURL(type.modelName, id), 'GET', {
      data: query
    });
  },

  buildURL(type, id) {
    let url = this._super(type, id);
    return url.slice(-1) !== '/' ? url + '/' : url;
  }
});
