'use strict';

var _merge = require('lodash/merge');
var filterDeep$1 = require('./filterDeep.js');
var pathMatches = require('./pathMatches.js');

var deps = _merge({ merge: _merge }, pathMatches.default, filterDeep$1.default);

exports.default = deps;
