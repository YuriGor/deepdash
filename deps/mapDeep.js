'use strict';

var _merge = require('lodash/merge');
var _isObject = require('lodash/isObject');
var eachDeep$1 = require('./eachDeep.js');
var _clone = require('lodash/clone');
var _set = require('lodash/set');
var _iteratee = require('lodash/iteratee');
var _isArray = require('lodash/isArray');

var deps = _merge(
  {
    iteratee: _iteratee,
    isArray: _isArray,
    isObject: _isObject,
    clone: _clone,
    set: _set,
  },
  eachDeep$1.default
);

exports.default = deps;
