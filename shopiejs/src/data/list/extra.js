import { Nil, Cons } from './core'
import { Just, Nothing } from './maybe'
import * as fl from 'shopie/util/fantasy'

export function fromArray(xs) {
  return xs.reduceRight((prev, current) => Cons(current, prev), Nil())
}

export function fromFoldable(foldable) {
  return foldable[fl.reduce]((prev, current) => Cons(current, prev), Nil())
}

export function toArray(xs) {
  return xs[fl.reduce]((prev, current) => prev.concat(current), [])
}

export function head(xs) {
  return xs.matchWith({
    Nil:  () => Nothing(),
    Cons: () => Just(xs.head)
  })
}

export function tail(xs) {
  return xs.matchWith({
    Nil:  () => Nothing(),
    Cons: () => Just(xs.tail)
  })
}
