'use strict';

var _merge = require('lodash/merge.js');
var eachDeep = require('./eachDeep.js');
var _cloneDeep = require('lodash/cloneDeep.js');
var _iteratee = require('lodash/iteratee.js');

var deps = _merge(
  {
    iteratee: _iteratee,
    cloneDeep: _cloneDeep,
    merge: _merge,
  },
  eachDeep
);

module.exports = deps;
