import _ from 'lodash';
import postprocess from 'rollup-plugin-postprocess';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import fs from 'fs';
import path from 'path';
import buble from 'rollup-plugin-buble';
var es = fs.readdirSync('./es').filter((fn) => _.endsWith(fn, '.js'));
var input = es.reduce((res, fn) => {
  res[path.basename(fn, '.js')] = './es/' + fn;
  return res;
}, {});
es = fs.readdirSync('./es/deps/own/').filter((fn) => _.endsWith(fn, '.js'));
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
      sourcemap: true,
      interop: false,
    },
    plugins: [resolve(), commonjs(), buble(), terser()],
  },
  {
    input: 'es/deepdash.js',
    output: {
      name: 'deepdash',
      file: pkg.browser.replace('.min.', '.'),
      format: 'iife',
      esModule: false,
      sourcemap: true,
      interop: false,
    },
    plugins: [resolve(), commonjs(), buble()],
  },
  {
    input: 'es/standalone.js',
    output: {
      name: 'deepdash',
      file: pkg.browser.replace('.min.', '.standalone.'),
      format: 'iife',
      esModule: false,
      sourcemap: true,
      interop: false,
    },
    plugins: [resolve(), commonjs(), buble()],
  },
  {
    input: 'es/standalone.js',
    output: {
      name: 'deepdash',
      file: pkg.browser.replace('.min.', '.standalone.min.'),
      format: 'iife',
      esModule: false,
      sourcemap: true,
      interop: false,
    },
    plugins: [resolve(), commonjs(), buble(), terser()],
  },
  {
    input,
    external: (id, parentId, isResolved) => _.startsWith(id, 'lodash/'),
    output: [{ dir: './', format: 'cjs', interop: false }],
    preserveModules: true,
    plugins: [
      replace({
        include: 'es/deps/**',
        delimiters: ['', ''],
        values: {
          'lodash-es': 'lodash',
        },
      }),
      buble(),
      postprocess([
        [
          /function\s_interopDefault.+$/gm,
          (token) => '/* istanbul ignore next */\n' + token,
        ],
      ]),
    ],
  },
];
