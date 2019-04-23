'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _merge = _interopDefault(require('lodash/merge'));
var __chunk_3 = require('./chunk-6127be9d.js');
var _isString = _interopDefault(require('lodash/isString'));
var _toPath = _interopDefault(require('lodash/toPath'));
var __chunk_5 = require('./chunk-226c628e.js');
var _isEqual = _interopDefault(require('lodash/isEqual'));
var _takeRight = _interopDefault(require('lodash/takeRight'));

var deps = _merge(
  {
    isString: _isString,
    isArray: __chunk_3._isArray,
    toPath: _toPath,
    isEqual: _isEqual,
    takeRight: _takeRight,
  },
  __chunk_5.deps
);

exports.deps = deps;
