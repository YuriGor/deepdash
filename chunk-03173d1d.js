'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _merge = _interopDefault(require('lodash/merge'));
var isArray = require('./isArray.js');
var _isObject = _interopDefault(require('lodash/isObject'));
var __chunk_3 = require('./chunk-b49b6706.js');
var __chunk_4 = require('./chunk-6b1697aa.js');
var __chunk_5 = require('./chunk-5e815ba3.js');
var _clone = _interopDefault(require('lodash/clone'));
var __chunk_6 = require('./chunk-d297bbe4.js');
var _cloneDeep = _interopDefault(require('lodash/cloneDeep'));
var _each = _interopDefault(require('lodash/each'));
var _eachRight = _interopDefault(require('lodash/eachRight'));
var _has = _interopDefault(require('lodash/has'));
var _set = _interopDefault(require('lodash/set'));
var _unset = _interopDefault(require('lodash/unset'));
var _isPlainObject = _interopDefault(require('lodash/isPlainObject'));
var _iteratee = _interopDefault(require('lodash/iteratee'));
var __chunk_7 = require('./chunk-4b9ace32.js');

var deps = _merge(
  {
    merge: _merge,
    clone: _clone,
    cloneDeep: _cloneDeep,
    isArray: isArray,
    isObject: _isObject,
    each: _each,
    eachRight: _eachRight,
    has: _has,
    set: _set,
    unset: _unset,
    isPlainObject: _isPlainObject,
    iteratee: _iteratee,
  },
  __chunk_3.eachDeepDeps,
  __chunk_4.deps,
  __chunk_7.deps,
  __chunk_5.condenseDeepDeps,
  __chunk_6.existsDeps
);

exports.filterDeepDeps = deps;
