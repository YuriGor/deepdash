'use strict';

var _merge = require('lodash/merge');
var eachDeep = require('./eachDeep.js');
var _cloneDeep = require('lodash/cloneDeep');
var _iteratee = require('lodash/iteratee');

var deps = _merge(
  {
    iteratee: _iteratee,
    cloneDeep: _cloneDeep,
    merge: _merge,
  },
  eachDeep
);

module.exports = deps;
