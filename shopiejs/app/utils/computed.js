import Ember from 'ember';

const { computed } = Ember;

export default computed;

export function boundOneWay(upstream, transform) {
  if (typeof transform !== 'function') {
    transform = value => value;
  }
  return computed(upstream, {
    get() {
      return transform(this.get(upstream));
    },
    set(key, value) {
      return value;
    }
  });
}

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
