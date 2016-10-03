import { h } from './dom/vnode'
import { data, show } from './core/adt'
import { noEffects } from 'jonggrang.core'

const Action = data('counter.Action', {
  Increment: () => ({}),
  Decrement: () => ({})
}).derive(show)

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
