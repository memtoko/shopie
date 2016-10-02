import { h } from './dom/vnode'
import { data } from './data/adt'
import { noEffects } from 'jonggrang.core'

const Action = data('counter.Action', {
  Increment: () => ({}),
  Decrement: () => ({})
})

const { Increment, Decrement } = Action

export const update = (action, state) => {
  return action.matchWith({
    Increment: () => noEffects(state + 1),
    Decrement: () => noEffects(state - 1)
  })
}

export const subscriptions = () => {
  return []
}

export const init = 0

export const view = (action, state) => {
  return h('div', [
    h('button', { on: { click: [action, Increment()] } }, '+'),
    h('div', state),
    h('button', { on: { click: [action, Decrement()] } }, '-')
  ])
}
