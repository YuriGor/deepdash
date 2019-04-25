'use strict';

var isArray = require('./own/isArray.js');
var _isString = require('lodash/isString');
var _reduce = require('lodash/reduce');

var deps = {
  isString: _isString,
  isArray: isArray,
  reduce: _reduce,
};

exports.default = deps;
