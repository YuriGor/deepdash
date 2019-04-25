'use strict';

var _merge = require('lodash/merge');
var __chunk_8 = require('./eachDeep.js');
var _iteratee = require('lodash/iteratee');

var deps = _merge(
  {
    iteratee: _iteratee,
  },
  __chunk_8.default
);

exports.default = deps;
