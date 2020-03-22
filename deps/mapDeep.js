'use strict';

var _merge = require('lodash/merge');
var _iteratee = require('lodash/iteratee');
var reduceDeep = require('./reduceDeep.js');

var deps = _merge(
  {
    iteratee: _iteratee,
  },
  reduceDeep
);

module.exports = deps;
