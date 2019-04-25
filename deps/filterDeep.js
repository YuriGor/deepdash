'use strict';

var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var _isObject = require('lodash/isObject');
var __chunk_6 = require('./pathToString.js');
var __chunk_8 = require('./eachDeep.js');
var __chunk_9 = require('./condenseDeep.js');
var _clone = require('lodash/clone');
var __chunk_10 = require('./exists.js');
var _cloneDeep = require('lodash/cloneDeep');
var _each = require('lodash/each');
var _eachRight = require('lodash/eachRight');
var _has = require('lodash/has');
var _set = require('lodash/set');
var _unset = require('lodash/unset');
var _isPlainObject = require('lodash/isPlainObject');
var _iteratee = require('lodash/iteratee');
var __chunk_11 = require('./obtain.js');

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
  __chunk_8.default,
  __chunk_6.default,
  __chunk_11.default,
  __chunk_9.default,
  __chunk_10.default
);

exports.default = deps;
