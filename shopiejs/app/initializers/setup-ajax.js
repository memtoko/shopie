import Ember from 'ember';
import AjaxService from '../services/ajax';

function _isArray(test) {
  return Object.prototype.toString.call(test) === "[object Array]";
}

function inject(registry, factoryNameOrType, property, injectionName) {
  let injector = registry.inject || registry.injection;
  if (_isArray(factoryNameOrType)) {
    for (let factory of factoryNameOrType) {
      inject(registry, factory, property, injectionName);
    }
  } else {
    injector.call(registry, factoryNameOrType, property, injectionName);
  }
}

export function setupAjax(registry) {
  inject(registry, 'service:ajax', 'session', 'service:session');
  inject(registry, ['route', 'controller', 'model'], 'ajax', 'service:ajax');
};

export default {
  name: 'setup-ajax-service',
  initialize: setupAjax
}
