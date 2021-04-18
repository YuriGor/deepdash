'use strict';

var _merge = require('lodash/merge.js');
var _isObject = require('lodash/isObject.js');
var _get = require('lodash/get.js');
var eachDeep = require('./eachDeep.js');
var condenseDeep = require('./condenseDeep.js');
var _clone = require('lodash/clone.js');
var _cloneDeep = require('lodash/cloneDeep.js');
var _each = require('lodash/each.js');
var _eachRight = require('lodash/eachRight.js');
var _has = require('lodash/has.js');
var _set = require('lodash/set.js');
var _unset = require('lodash/unset.js');
var _isPlainObject = require('lodash/isPlainObject.js');
var _iteratee = require('lodash/iteratee.js');

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
