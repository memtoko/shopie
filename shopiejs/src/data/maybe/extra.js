import { Just, Nothing } from './core'
import { curry, identity, constant } from 'shopie/core/lambda'

/**
 * @summary maybe :: (unit -> b) -> (a -> b) -> Maybe a -> b
 */
export const maybe = curry(3, (caseNothing, caseJust, maybe) => {
  return maybe.matchWith({
    Just    : ({ value }) => caseJust(value),
    Nothing : ()          => caseNothing()
  })
})

/**
 * take a value that maybe null then encode it to Maybe
 */
export const fromNullable = x => x == null ? Just(x) : Nothing()

/**
 * take a function and a maybe, when it Nothing then the function will be invoked
 * otherwise value inside Just returned.
 *
 * fromMaybe :: (unit -> a) -> Maybe a -> a
 */
export const fromMaybe = curry(2, (caseNothing, m) => {
  return maybe(caseNothing, identity, m)
})

/**
 * Returns `true` when the `Maybe` value was constructed with `Just`.
 *
 * isJust :: Maybe a -> boolean
 */
export const isJust = maybe(constant(false), constant(true))

/**
 * Returns `true` when the `Maybe` value was constructed with `Nothing`.
 *
 * isNothing :: Maybe a -> boolean
 */
export const isNothing = maybe(constant(true), constant(false))
