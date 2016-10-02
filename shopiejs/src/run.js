import { application } from 'jonggrang.core'

/**
 * Run the application using side effects drivers. Driver is a function that accept
 * app object returned by jonggrang.core's application function.
 *
 * @param config A config for Application, it's an object with fields: update (function)
 *        init (initial state), and subscriptions (function)
 * @return void
 */
export function run(config, drivers) {
  let app = application(config)
  // we will kick all drivers in requestAnimationFrame
  requestAnimationFrame(() => {
    drivers.forEach(driver => driver(app))
  })
}