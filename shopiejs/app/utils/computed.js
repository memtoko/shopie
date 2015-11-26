import Ember from 'ember';

const { computed } = Ember;

export default computed;

export function propertyEqual(a, b) {
  return computed(a, b, function() {
    return this.get(a) === this.get(b);
  });
}

export function propertyNotEqual(a, b) {
  return computed(a, b, function() {
    return this.get(a) !== this.get(b);
  });
}

export function propertyGreaterThan(a, b) {
  return computed(a, b, function() {
    return this.get(a) > this.get(b);
  });
}

export function propertyLessThan(a, b) {
  return computed(a, b, function() {
    return this.get(a) < this.get(b);
  });
}
