import _ from 'lodash';
import postprocess from 'rollup-plugin-postprocess';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import fs from 'fs';
import path from 'path';
var src = fs.readdirSync('./src').filter((fn) => fn.indexOf('.js') > -1);
var input = src.reduce((res, fn) => {
  res[path.basename(fn, '.js')] = './src/' + fn;
  return res;
}, {});
src = fs.readdirSync('./src/standalone').filter((fn) => fn.indexOf('.js') > -1);
var standalone = src.reduce((res, fn) => {
  res[path.basename(fn, '.js')] = './src/standalone/' + fn;
  return res;
}, {});
src = fs
  .readdirSync('./src/standalone/deps/own/')
  .filter((fn) => fn.indexOf('.js') > -1);
var ownDeps = src.reduce((res, fn) => {
  res[path.basename(fn, '.js')] = './src/standalone/deps/own/' + fn;
  return res;
}, {});
input = _.merge(input, standalone, ownDeps);
// console.log(input);

export default [
  // browser-friendly UMD build
  {
    input: 'src/deepdash.js',
    output: {
      name: 'deepdash',
      file: pkg.browser,
      format: 'umd',
      esModule: false,
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      terser(),
    ],
  },
  // not minified
  {
    input: 'src/deepdash.js',
    output: {
      name: 'deepdash',
      file: pkg.browser.replace('.min.', '.'),
      format: 'umd',
      esModule: false,
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    ],
  },
  {
    input,
    external: ['lodash-es', 'lodash'],
    output: [
      { dir: 'dist/cjs', format: 'cjs' },
      { dir: 'dist/esm', format: 'es' },
    ],
    plugins: [
      replace({
        include: 'src/standalone/deps/**',
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
