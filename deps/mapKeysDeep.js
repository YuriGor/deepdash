'use strict';

var _merge = require('lodash/merge');
var _cloneDeep = require('lodash/cloneDeep');
var _has = require('lodash/has');
var _unset = require('lodash/unset');
var mapValuesDeep = require('./mapValuesDeep.js');

var deps = _merge(
  {
    cloneDeep: _cloneDeep,
    has: _has,
    unset: _unset,
  },
  mapValuesDeep
);

module.exports = deps;
