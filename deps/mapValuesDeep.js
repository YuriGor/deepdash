'use strict';

var _merge = require('lodash/merge');
var _isObject = require('lodash/isObject');
var eachDeep = require('./eachDeep.js');
var _clone = require('lodash/clone');
var _set = require('lodash/set');
var _iteratee = require('lodash/iteratee');

var deps = _merge(
  {
    iteratee: _iteratee,
    isObject: _isObject,
    clone: _clone,
    set: _set,
  },
  eachDeep
);

module.exports = deps;
