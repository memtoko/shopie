import { DOM } from './dom/snabbdom'
import { run } from './run'
import { init, subscriptions, update, view } from './counter'

const config = {
  init,
  subscriptions,
  update
}

run(config, [DOM('#app', view)])