import { array as isArray, primitive as isPrimitive } from 'snabbdom/is'

export function VNode(sel, data, children, text, elm) {
  let key = data === undefined ? undefined : data.key
  return { sel, data, children, text, elm, key }
}

function addNS(data, children, sel) {
  data.ns = 'http://www.w3.org/2000/svg'

  if (sel !== 'foreignObject' && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      addNS(children[i].data, children[i].children, children[i].sel)
    }
  }
}

export function h(sel, b, c) {
  let data = {}
  let children
  let text
  let i
  if (c !== undefined) {
    data = b
    if (isArray(c)) {
      children = c
    } else if (isPrimitive(c)) {
      text = c
    }
  } else if (b !== undefined) {
    if (isArray(b)) {
      children = b
    } else if (isPrimitive(b)) {
      text = b
    } else {
      data = b
    }
  }
  if (isArray(children)) {
    for (i = 0; i < children.length; ++i) {
      if (isPrimitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i])
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
    addNS(data, children, sel)
  }
  return VNode(sel, data, children, text, undefined)
}

function copyToThunk(vnode, thunk) {
  thunk.elm = vnode.elm
  vnode.data.fn = thunk.data.fn
  vnode.data.args = thunk.data.args
  thunk.data = vnode.data
  thunk.children = vnode.children
  thunk.text = vnode.text
  thunk.elm = vnode.elm
}

function init(thunk) {
  const cur = thunk.data
  const vnode = cur.fn.apply(undefined, cur.args)
  copyToThunk(vnode, thunk)
}

function prepatch(oldVnode, thunk) {
  let old = oldVnode.data
  let cur = thunk.data
  let oldArgs = old.args
  let args = cur.args
  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    copyToThunk(cur.fn.apply(undefined, args), thunk)
  }
  for (let i = 0; i < args.length; ++i) {
    if (oldArgs[i] !== args[i]) {
      copyToThunk(cur.fn.apply(undefined, args), thunk)
      return
    }
  }
  copyToThunk(oldVnode, thunk)
}

export function thunk(sel, key, fn, args) {
  return h(sel, {
    key: args === undefined ? undefined : key,
    hook: { init, prepatch },
    fn: args === undefined ? key : fn,
    args: args === undefined ? fn : args
  })
}
