'use strict';

var _merge = require('lodash/merge');
var _isObject = require('lodash/isObject');
var _get = require('lodash/get');
var eachDeep = require('./eachDeep.js');
var condenseDeep = require('./condenseDeep.js');
var _clone = require('lodash/clone');
var _cloneDeep = require('lodash/cloneDeep');
var _each = require('lodash/each');
var _eachRight = require('lodash/eachRight');
var _has = require('lodash/has');
var _set = require('lodash/set');
var _unset = require('lodash/unset');
var _isPlainObject = require('lodash/isPlainObject');
var _iteratee = require('lodash/iteratee');

var deps = _merge(
  {
    merge: _merge,
    clone: _clone,
    cloneDeep: _cloneDeep,
    isObject: _isObject,
    each: _each,
    eachRight: _eachRight,
    has: _has,
    set: _set,
    unset: _unset,
    isPlainObject: _isPlainObject,
    iteratee: _iteratee,
    get: _get,
  },
  eachDeep,
  condenseDeep
);

module.exports = deps;
