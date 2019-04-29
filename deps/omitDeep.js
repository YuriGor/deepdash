'use strict';

var _merge = require('lodash/merge');
var __chunk_12 = require('./filterDeep.js');
var __chunk_16 = require('./pathMatches.js');

var deps = _merge({ merge: _merge }, __chunk_16.default, __chunk_12.default);

exports.default = deps;
