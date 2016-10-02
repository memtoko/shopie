import babel from 'rollup-plugin-babel'
import babelrc from 'babelrc-rollup'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: __dirname + '/src/index.js',
  plugins: [
    babel(babelrc({
      path: __dirname + '/.babelrc'
    })),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**/*',
      namedExports: {
        'flyd': [ 'merge', 'map', 'stream', 'on', 'scan', 'combine', 'immediate', 'endsOn'],
        'snabbdom': ['init'],
        'snabbdom/is': ['primitive', 'array']
      }
    })
  ],
  targets: [
    {
      dest: __dirname + '/dist/main.js',
      format: 'iife',
      moduleName: 'shopie',
      sourceMap: false
    }
  ]
}
