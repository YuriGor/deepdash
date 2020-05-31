'use strict';

var _merge = require('lodash/merge');
var _isObject = require('lodash/isObject');
var _isEmpty = require('lodash/isEmpty');
var _get = require('lodash/get');
var pathToString = require('./pathToString.js');

var deps = _merge(
  {
    isObject: _isObject,
    isEmpty: _isEmpty,
    get: _get,
  },
  pathToString
  // hasChildrenDeps
);

module.exports = deps;
