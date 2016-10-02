import { init } from 'snabbdom'
import { scan, map } from 'flyd'
import * as propModule from 'snabbdom/modules/props'
import * as styleModule from 'snabbdom/modules/style'
import * as classModule from 'snabbdom/modules/class'
import * as eventModule from 'snabbdom/modules/eventlisteners'

const patch = init([
  propModule,
  styleModule,
  classModule,
  eventModule
])

export const DOM = (selector, view) =>
  ({state, action}) => {
    const vnode = map((s) => view(action, s), state)
    const container = document.querySelector(selector)
    if (!container) {
      throw new Error(`Please, verify there are a DOM with selector ${selector}`)
    }
    scan(patch, container, vnode)
  }
