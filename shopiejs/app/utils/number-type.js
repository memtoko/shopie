var toString = Object.prototype.toString;

export function isFinite(value) {
  return window.isFinite(value) && !window.isNaN(parseFloat(value));
}

export default function isNumber(value) {
  return typeof value === 'number' ||
    value && typeof value === 'object' && toString.call(value) === '[object Number]' || false;
}
