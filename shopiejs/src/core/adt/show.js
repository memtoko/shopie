import { TAG, TYPE } from './core'

const objectToKeyValuePairs = (object) =>
  Object.keys(object)
        .map((key) => `${key}: ${showValue(object[key])}`)
        .join(', ')

const plainObjectToString = function() {
  return `{ ${objectToKeyValuePairs(this)} }`
}

const arrayToString = function() {
  return `[${this.map(showValue).join(', ')}]`
}

const functionNameToString = (fn) => fn.name !== '' ? `: ${fn.name}` : ''

const functionToString = (fn) => `[Function${functionNameToString(fn)}]`

const nullToString = () => 'null'

const objectToString = (object) =>
    object === null                       ?  nullToString
  : Array.isArray(object)                 ?  arrayToString
  : object.toString() === ({}).toString() ?  plainObjectToString
  : /* otherwise */                          object.toString

const showValue = (value) =>
    typeof value === 'undefined' ?  'undefined'
  : typeof value === 'function'  ?  functionToString(value)
  : typeof value === 'symbol'    ?  value.toString()
  : typeof value === 'object'    ?  objectToString(value).call(value)
  : /* otherwise */                 JSON.stringify(value)

export const show = (variant, adt) => {
  const typeName    = adt[TYPE]
  const variantName = `${adt[TYPE]}.${variant.prototype[TAG]}`

  adt[Symbol.toStringTag]               = typeName
  variant.prototype[Symbol.toStringTag] = variantName

  adt.toString = () => typeName

  variant.toString = () => variantName;

  variant.prototype.toString = function() {
    return `${variantName}(${plainObjectToString.call(this)})`;
  }

  adt.inspect                = adt.toString
  variant.inspect            = variant.toString
  variant.prototype.inspect  = variant.prototype.toString

  return variant
}
