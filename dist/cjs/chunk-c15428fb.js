'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var __chunk_2 = require('./chunk-38e2ecce.js');
var _merge = _interopDefault(require('lodash/merge'));
var __chunk_3 = require('./chunk-6127be9d.js');
var __chunk_4 = require('./chunk-4c696124.js');

var deps = _merge(
  {
    merge: _merge,
    isArray: __chunk_3._isArray,
    forArray: __chunk_4.forArray,
  },
  __chunk_2.condenseDeps,
  __chunk_4.eachDeepDeps
);

exports.condenseDeepDeps = deps;
