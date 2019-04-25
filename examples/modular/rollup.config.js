import replace from 'rollup-plugin-replace';
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

export default [
  {
    input: { main: './src/main.js' },
    output: {
      dir: './dist/browser',
      format: 'iife',
      esModule: false,
      sourcemap: true,
      interop: false,
    },
    plugins: [resolve(), commonjs()],
  },
  {
    input,
    external: ['deepdash', 'deepdash/filterDeep', 'deepdash/es/filterDeep'],
    output: [{ dir: './dist/commonjs', format: 'cjs', interop: false }],
    plugins: [
      // replace({
      //   delimiters: ['', ''],
      //   values: {
      //     'deepdash/es': 'deepdash',
      //   },
      // }),
      resolve(),
      commonjs(),
    ],
  },
];
