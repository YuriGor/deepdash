'use strict';

var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var _isString = require('lodash/isString');
var _toPath = require('lodash/toPath');
var __chunk_6 = require('./pathToString.js');
var _isEqual = require('lodash/isEqual');
var _takeRight = require('lodash/takeRight');

var deps = _merge(
  {
    isString: _isString,
    isArray: isArray,
    toPath: _toPath,
    isEqual: _isEqual,
    takeRight: _takeRight,
  },
  __chunk_6.default
);

exports.default = deps;
