/**
 * I combinator, it's just give back the argument to you.
 *
 * @summary identity :: a -> a
 */
export const identity = x => x

/**
 * K combinator, take an argument and return function that when called will return
 * that argument.
 *
 * @summary constant :: a -> * -> a
 */
export const constant = x => () => x

/**
 * @summary compose :: ((b -> c), (a -> b)) -> (a -> c)
 */
export let compose = (f, g) => x => f(g(x))

/**
 * Conveniently composes function with the This-Binding syntax.
 */
compose.infix = function (that) {
  return compose(that, this)
}

/**
 * Conveniently composes multiple (more than 2) functions
 */
compose.all = (...fns) => fns.reduce(compose)

/**
 *
 */
export const curry = (arity, fn) => {
  const curried = oldArgs => (...newArgS) => {
    const combine = oldArgs.concat(newArgS)
    const len = combine.length
    return len < arity      ? curried(combine)
    :      /* otherwise */    fn(...combine)
  }
  return curried([])
}
