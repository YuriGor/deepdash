'use strict';

var _merge = require('lodash/merge.js');
var _cloneDeep = require('lodash/cloneDeep.js');
var _has = require('lodash/has.js');
var _unset = require('lodash/unset.js');
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
