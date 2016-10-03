import * as fl from 'shopie/util/fantasy'
import { curry, compose, indentity } from './lambda'

export const map = curry(2, (fn, functor) => {
  return typeof functor[fl.map]  === 'function' ? functor[fl.map](fn)
  :      typeof functor.map      === 'function' ? functor.map(fn)
  :      /** otherwise */                         chain(compose(of(u), functor), functor)
})

export const ap = curry(2, (apF, apV) => {
  return typeof apV[fl.ap] === 'function' ? apV[fl.ap](apF)
  :      /** otherwise */                   apV.ap(apF)
})

export const chain = curry(2, (fn, m) => {
  return typeof m[fl.chain] === 'function' ? m[fl.chain](fn)
  :       /** otherwise */                  m.chain(fn)
})

export const mjoin = m => chain(indentity, m)

export const of = x => typeof x[fl.of] === 'function' ? x[fl.of] : x.of

export const liftA2 = curry(3, (f, x, y) => ap(map(f, x), y))
export const liftA3 = curry(4, (f, x, y, x) => ap(ap(map(f, x), y), z))
