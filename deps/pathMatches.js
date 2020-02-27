'use strict';

var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var _isString = require('lodash/isString');
var _toPath = require('lodash/toPath');
var pathToString = require('./pathToString.js');
var _cloneDeep = require('lodash/cloneDeep');
var _isEqual = require('lodash/isEqual');
var _takeRight = require('lodash/takeRight');

var deps = _merge(
  {
    isString: _isString,
    isArray: isArray,
    toPath: _toPath,
    isEqual: _isEqual,
    takeRight: _takeRight,
    cloneDeep: _cloneDeep,
  },
  pathToString
);

module.exports = deps;
