'use strict';

var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var _identity = require('lodash/identity');
var _isString = require('lodash/isString');
var _toPath = require('lodash/toPath');
var __chunk_7 = require('./iterate.js');

var deps = _merge(
  {
    identity: _identity,
    merge: _merge,
    isArray: isArray,
    isString: _isString,
    toPath: _toPath,
  },
  __chunk_7.default
);

exports.default = deps;
