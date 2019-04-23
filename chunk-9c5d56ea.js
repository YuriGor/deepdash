'use strict';

/* istanbul ignore next */
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isArray = require('./isArray.js');
var _isString = _interopDefault(require('lodash/isString'));
var _reduce = _interopDefault(require('lodash/reduce'));

var deps = {
  isString: _isString,
  isArray: isArray,
  reduce: _reduce,
};

exports.deps = deps;
