'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _merge = _interopDefault(require('lodash/merge'));
var __chunk_8 = require('./chunk-03173d1d.js');
var __chunk_9 = require('./chunk-7dcaf14e.js');

var deps = _merge({ merge: _merge }, __chunk_9.deps, __chunk_8.filterDeepDeps);

exports.omitDeepDeps = deps;
