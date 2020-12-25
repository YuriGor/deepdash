'use strict';

var _merge = require('lodash/merge');
var eachDeep = require('./eachDeep.js');
var _iteratee = require('lodash/iteratee');

var deps = _merge(
  {
    iteratee: _iteratee,
  },
  eachDeep
);

module.exports = deps;
