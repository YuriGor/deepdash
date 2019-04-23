import _ from 'lodash';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default [
  // browser-friendly build
  {
    input: 'src/main.js',
    output: {
      name: 'main',
      file: pkg.browser,
      format: 'iife',
    },
    plugins: [
      replace({
        delimiters: ['', ''],
        values: {
          'lodash-es': 'lodash',
        },
      }),
      resolve(),
      commonjs(),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/main.js',
    external: (id) =>
      _.startsWith(id, 'lodash') || _.startsWith(id, 'deepdash'),
    output: [{ file: pkg.main, format: 'cjs' }],
    plugins: [
      replace({
        delimiters: ['', ''],
        values: {
          'lodash-es': 'lodash',
        },
      }),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    ],
  },
];
