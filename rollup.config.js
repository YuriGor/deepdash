import _ from 'lodash';
import postprocess from 'rollup-plugin-postprocess';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import fs from 'fs';
import path from 'path';
var es = fs.readdirSync('./es').filter((fn) => fn.indexOf('.js') > -1);
var input = es.reduce((res, fn) => {
  res[path.basename(fn, '.js')] = './es/' + fn;
  return res;
}, {});
es = fs.readdirSync('./es/deps/own/').filter((fn) => fn.indexOf('.js') > -1);
var ownDeps = es.reduce((res, fn) => {
  res[path.basename(fn, '.js')] = './es/deps/own/' + fn;
  return res;
}, {});
input = _.merge(input, ownDeps);
// console.log(input);

export default [
  {
    input: 'es/deepdash.js',
    output: {
      name: 'deepdash',
      file: pkg.browser,
      format: 'iife',
      esModule: false,
    },
    plugins: [resolve(), commonjs(), terser()],
  },
  {
    input: 'es/deepdash.js',
    output: {
      name: 'deepdash',
      file: pkg.browser.replace('.min.', '.'),
      format: 'iife',
      esModule: false,
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: 'es/standalone.js',
    output: {
      name: 'deepdash',
      file: pkg.browser.replace('.min.', '.standalone.'),
      format: 'iife',
      esModule: false,
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input: 'es/standalone.js',
    output: {
      name: 'deepdash',
      file: pkg.browser.replace('.min.', '.standalone.min.'),
      format: 'iife',
      esModule: false,
    },
    plugins: [resolve(), commonjs(), terser()],
  },
  {
    input,
    external: (id, parentId, isResolved) => _.startsWith(id, 'lodash/'),
    output: [{ dir: './', format: 'cjs' }],
    plugins: [
      replace({
        include: 'es/deps/**',
        delimiters: ['', ''],
        values: {
          'lodash-es': 'lodash',
        },
      }),
      postprocess([
        [
          /function\s_interopDefault.+$/gm,
          (token) => '/* istanbul ignore next */\n' + token,
        ],
      ]),
    ],
  },
];
