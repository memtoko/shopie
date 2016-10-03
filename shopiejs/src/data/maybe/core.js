import { data } from 'shopie/core/adt'
import * as fl from 'shopie/util/fantasy'

const Maybe = data('shopie.data.Maybe', {
  Nothing()   { return {} },
  Just(value) { return { value } }
})

const { Nothing, Just } = Maybe

// Setoid
Nothing.prototype[fl.equals] = function (maybe) {
  return Nothing.hasInstance(maybe)
}

Just.prototype[fl.equals] = function (maybe) {
  return Just.hasInstance(maybe) && maybe.value === this.value
}

// Functor
Nothing.prototype[fl.map] = function () {
  return this
}

Just.prototype[fl.map] = function (transformation) {
  return Just(transformation(this.value))
}

// Apply
Nothing.prototype[fl.ap] = function () {
  return this
}

Just.prototype[fl.ap] = function (maybe) {
  return maybe[fl.map](f => f(this.value))
}

// Applicative
Maybe[fl.of] = Just

// Chain
Nothing.prototype[fl.chain] = function () {
  return this
}

Just.prototype[fl.chain] = function (transformation) {
  return transformation(this.value)
}

// Show
Maybe[Symbol.toStringTag] = 'shopie.data.Maybe'
Nothing.prototype[Symbol.toStringTag] = 'shopie.data.Maybe.Nothing'
Just.prototype[Symbol.toStringTag] = 'shope.data.Maybe.Just'

Maybe.toString = () => 'Maybe'
Nothing.prototype.toString = () => 'Nothing'
Just.prototype.toString = function () {
  let str = typeof this.value === 'symbol' ? this.value.toString() : this.value
  return Just(`${str}`)
}

// (Node REPL representations)
Maybe.inspect = Maybe.toString
Nothing.prototype.inspect = Maybe.Nothing.prototype.toString
Just.prototype.inspect = Maybe.Just.prototype.toString

// choosing
Nothing.prototype.orElse = function (handler) {
  return handler()
}

Just.prototype.orElse = function () {
  return this
}

export { Maybe as type, Nothing, Just }
