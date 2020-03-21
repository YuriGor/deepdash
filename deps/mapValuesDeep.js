'use strict';

var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var isObject = require('./own/isObject.js');
var eachDeep$1 = require('./eachDeep.js');
var _clone = require('lodash/clone');
var _set = require('lodash/set');
var _iteratee = require('lodash/iteratee');

var deps = _merge(
  {
    iteratee: _iteratee,
    isArray: isArray,
    isObject: isObject,
    clone: _clone,
    set: _set,
  },
  eachDeep$1
);

module.exports = deps;
