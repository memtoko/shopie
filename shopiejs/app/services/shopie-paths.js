import Ember from 'ember';
import shopiePaths from 'shopie/utils/shopie-paths';

export default Ember.Service.extend(Ember._ProxyMixin, {
  content: shopiePaths()
});
