'use strict';

var _merge = require('lodash/merge');
var omitDeep = require('./omitDeep.js');

var deps = _merge({ merge: _merge }, omitDeep);

module.exports = deps;
