'use strict';

var _merge = require('lodash/merge');
var eachDeep$1 = require('./eachDeep.js');
var _iteratee = require('lodash/iteratee');

var deps = _merge(
  {
    iteratee: _iteratee,
  },
  eachDeep$1
);

module.exports = deps;
