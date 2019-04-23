'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _merge = _interopDefault(require('lodash/merge'));
var __chunk_3 = require('./chunk-6127be9d.js');
var _identity = _interopDefault(require('lodash/identity'));
var _isString = _interopDefault(require('lodash/isString'));
var _toPath = _interopDefault(require('lodash/toPath'));
var _isObject = _interopDefault(require('lodash/isObject'));
var _isEmpty = _interopDefault(require('lodash/isEmpty'));
var _findIndex = _interopDefault(require('lodash/findIndex'));
var _forOwn = _interopDefault(require('lodash/forOwn'));
var _get = _interopDefault(require('lodash/get'));
var _some = _interopDefault(require('lodash/some'));
var __chunk_5 = require('./chunk-226c628e.js');

function forArray(arr, iteratee) {
  for (var i = 0; i < arr.length; i++) {
    if (iteratee(arr[i], i, arr) === false) break;
  }
  return arr;
}

var deps = {
  some: _some,
  get: _get,
  isEmpty: _isEmpty,
};

var deps$1 = _merge(
  {
    isObject: _isObject,
    isEmpty: _isEmpty,
    findIndex: _findIndex,
    forOwn: _forOwn,
    forArray: forArray,
    get: _get,
    isArray: __chunk_3._isArray,
  },
  __chunk_5.deps,
  deps
);

var deps$2 = _merge(
  {
    identity: _identity,
    merge: _merge,
    isArray: __chunk_3._isArray,
    isString: _isString,
    toPath: _toPath,
  },
  deps$1
);

exports.eachDeepDeps = deps$2;
exports.forArray = forArray;
