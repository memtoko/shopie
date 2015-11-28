import DS from 'ember-data';
import shopiePaths from '../utils/shopie-paths';
import ensureSlash from '../utils/ensure-slash';

export default DS.JSONAPIAdapter.extend({
  host: window.location.origin,
  namespace: shopiePaths().apiRoot.slice(1),

  /*
  Our server support GET /type?ids[]=1&ids[]=2
  so trun this on.
  */
  coalesceFindRequests: true,

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
    return ensureSlash(this._super(type, id));
  }
});
