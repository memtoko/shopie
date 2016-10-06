import { data } from './core/adt'
import { Just, Nothing } from './data/maybe'
import { Cons, Nil, fromArray } from './data/list'

const RoutePart = data('shopie.RoutePart', {
  Path:  (value) => ({ value }),
  Query: (value) => ({ value })
})

const { Path, Query } = RoutePart

function parsePath(path) {
  return path.split('/').map(Path)
}
