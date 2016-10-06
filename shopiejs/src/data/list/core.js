import { data } from 'shopie.core.adt'
import * as fl from 'shopie/util/fantasy'

const List = data('shopie.data.List', {
  Nil() { return {} },
  Cons(head, tail) { return { head, tail } }
})

const { Nil, Cons } = List

Cons.prototype[fl.concat] = function (xs) {
  let result = singleton(this.head)
  let current = result
  let ys = this.tail
  while (!Nil.hasInstance(ys)) {
    result.tail = singleton(ys.head)
    current = result.tail
    ys = ys.tail
  }
  current.tail = xs
  return result
}

Nil.prototype[fl.concat] = function (xs) {
  return xs
}

List[fl.empty] = Nil

Cons.prototype[fl.map] = function (fun) {
  let result = singleton(fun(this.head))
  let current = result
  let xs = this.tail
  while (!Nil.hasInstance(xs)) {
    current.tail = singleton(fun(xs.head))
    current = current.tail
    xs = xs.tail
  }
  return result
}

Nil.prototype[fl.map] = function () {
  return this
}

List[fl.of] = singleton

Cons.prototype[fl.ap] = function (xs) {
  return xs[fl.chain](f => this[fl.map](f))
}

Nil.prototype[fl.ap] = function (xs) {
  xs
}

Cons.prototype[fl.chain] = function (fun) {
  let result = undefined
  let current = undefined
  let xs = this
  while (!Nil.hasInstance(xs)) {
    let ys = fun(xs.head)
    while (!Nil.hasInstance(ys)) {
      if (typeof result !== 'undefined') {
        current.tail = singleton(ys.head)
        current = current.tail
      } else {
        result = current = singleton(ys.head)
      }
      ys = ys.tail
    }
    xs = xs.tail
  }
  return result
}

Nil.prototype[fl.chain] = function () {
  return this
}

Cons.prototype[fl.reduce] = function (fun, acc) {
  let xs = this
  while (!Nil.hasInstance(xs)) {
    acc = fun(acc, xs.head)
    xs = xs.tail
  }
  return acc
}

Nil.prototype[fl.reduce] = function (_, acc) {
  return acc
}

Cons.prototype[fl.equals] = function(ys) {
  if (!Cons.hasInstance(ys)) {
    return false;
  }
  let xs = this;
  while (!Nil.hasInstance(xs)) {
    if (xs.head !== ys.head) {
      return false;
    }
    xs = xs.tail;
    ys = ys.tail;
    if (!Nil.hasInstance(xs) && Nil.hasInstance(ys)) {
      return false;
    }
  }
  return Nil.hasInstance(ys);
}

Nil.prototype[fl.equals] = function (xs) {
  return Nil.hasInstance(xs)
}

function singleton(x) {
  return Cons(x, Nil())
}

export { List as type, Nil, Cons, singleton }
