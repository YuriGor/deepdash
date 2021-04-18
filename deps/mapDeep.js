'use strict';

var _merge = require('lodash/merge.js');
var eachDeep = require('./eachDeep.js');
var _iteratee = require('lodash/iteratee.js');

var deps = _merge(
  {
    iteratee: _iteratee,
  },
  eachDeep
);

module.exports = deps;
