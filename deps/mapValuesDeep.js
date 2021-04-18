'use strict';

var _merge = require('lodash/merge.js');
var _isObject = require('lodash/isObject.js');
var eachDeep = require('./eachDeep.js');
var _clone = require('lodash/clone.js');
var _set = require('lodash/set.js');
var _iteratee = require('lodash/iteratee.js');

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
