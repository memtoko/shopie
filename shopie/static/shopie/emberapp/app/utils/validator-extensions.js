import Ember from 'ember';

function init() {
  validator.extend('empty', (str) => Ember.isBlank(str));

  validator.extend('notContains', (str, badString) => str.indexOf(badString) === -1);
}

export default {
  init: init
};
