'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isArray = require('./isArray.js');
var _toPath = _interopDefault(require('lodash/toPath'));
var _get = _interopDefault(require('lodash/get'));
var _clone = _interopDefault(require('lodash/clone'));

var deps = {
  isArray: isArray,
  clone: _clone,
  toPath: _toPath,
  get: _get,
};

exports.existsDeps = deps;
