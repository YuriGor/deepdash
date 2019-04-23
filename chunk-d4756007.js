'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _merge = _interopDefault(require('lodash/merge'));
var isArray = require('./isArray.js');
var _isString = _interopDefault(require('lodash/isString'));
var _toPath = _interopDefault(require('lodash/toPath'));
var __chunk_4 = require('./chunk-9c5d56ea.js');
var _isEqual = _interopDefault(require('lodash/isEqual'));
var _takeRight = _interopDefault(require('lodash/takeRight'));

var deps = _merge(
  {
    isString: _isString,
    isArray: isArray,
    toPath: _toPath,
    isEqual: _isEqual,
    takeRight: _takeRight,
  },
  __chunk_4.deps
);

exports.deps = deps;
