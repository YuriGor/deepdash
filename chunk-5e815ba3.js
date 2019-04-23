'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var __chunk_2 = require('./chunk-38e2ecce.js');
var _merge = _interopDefault(require('lodash/merge'));
var isArray = require('./isArray.js');
var forArray = require('./forArray.js');
var __chunk_3 = require('./chunk-b49b6706.js');

var deps = _merge(
  {
    merge: _merge,
    isArray: isArray,
    forArray: forArray,
  },
  __chunk_2.condenseDeps,
  __chunk_3.eachDeepDeps
);

exports.condenseDeepDeps = deps;
