import DS from 'ember-data';
import shopiePaths from 'shopie/utils/shopie-paths';

export default DS.JSONAPIAdapter.extend({
    host: window.location.origin,
    namespace: shopiePaths().apiRoot.slice(1)
});
