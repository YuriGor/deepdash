'use strict';

var _merge = require('lodash/merge');
var __chunk_12 = require('./filterDeep.js');
var __chunk_15 = require('./pathMatches.js');

var deps = _merge({ merge: _merge }, __chunk_15.default, __chunk_12.default);

exports.default = deps;
