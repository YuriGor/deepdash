'use strict';

var _merge = require('lodash/merge.js');
var _isObject = require('lodash/isObject.js');
var _isEmpty = require('lodash/isEmpty.js');
var _get = require('lodash/get.js');
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
