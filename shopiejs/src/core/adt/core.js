/**
 * This code base Folktale ADT, we will remove this when Folktale released
 */

export const TYPE = Symbol.for('adt:type')
export const TAG  = Symbol.for('adt:tag')

const keys           = Object.keys
const symbols        = Object.getOwnPropertySymbols
const defineProperty = Object.defineProperty
const property       = Object.getOwnPropertyDescriptor

const mapObject = (object, transform) => {
  return keys(object).reduce((result, key) => {
    result[key] = transform(key, object[key])
    return result
  }, {})
}

function extend(target, ...sources) {
  sources.forEach(source => {
    keys(source).forEach(key => {
      if (key === 'prototype') {
        target[key] = source[key]
      } else {
        defineProperty(target, key, property(source, key))
      }
    })
    symbols(source).forEach(symbol => {
      defineProperty(target, symbol, property(source, symbol))
    })
  })
  return target
}

function defineVariants(typeId, patterns, adt) {
  return mapObject(patterns, (name, constructor) => {
    function Variant() {}
    Variant.prototype = Object.create(adt)

    extend(Variant.prototype, {
      [TAG]: name,
      constructor: constructor,
      matchWith(pattern) {
        return pattern[name](this)
      }
    })

    function makeInstance(...args) {
      let variant = new Variant()
      Object.assign(variant, constructor(...args))
      return variant
    }
    extend(makeInstance, {
      prototype: Variant.prototype,
      get tag() {
        return name
      },
      get type() {
        return typeId
      },
      get constructor() {
        return constructor
      },
      hasInstance(value) {
        return Boolean(value) && adt.hasInstance(value) && value[TAG] === name
      }
    })
    return makeInstance
  })
}

export const ADT = {
  derive(...derivations) {
    derivations.forEach(derivation => {
      this.variants.forEach(variant => derivation(this[variant], this))
    })
    return this
  }
}

export function data(typeId, patterns) {
  const ADTNamespace = Object.create(ADT)
  const variants     = defineVariants(typeId, patterns, ADTNamespace)
  extend(ADTNamespace, variants, {
    [TYPE]: typeId,
    variants: keys(variants),
    hasInstance(value) {
      return Boolean(value) && value[TYPE] === this[TYPE]
    }
  })
  return ADTNamespace
}
