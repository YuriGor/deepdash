'use strict';

var _merge = require('lodash/merge');
var filterDeep = require('./filterDeep.js');
var pathMatches = require('./pathMatches.js');

var deps = _merge({ merge: _merge }, pathMatches, filterDeep);

module.exports = deps;
