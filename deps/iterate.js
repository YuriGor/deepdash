'use strict';

var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var forArray = require('./own/forArray.js');
var isObject = require('./own/isObject.js');
var isEmpty = require('./own/isEmpty.js');
var _forOwn = require('lodash/forOwn');
var _get = require('lodash/get');
var hasChildren = require('./hasChildren.js');
var pathToString = require('./pathToString.js');

var deps = _merge(
  {
    isObject: isObject,
    isEmpty: isEmpty,
    forOwn: _forOwn,
    forArray: forArray,
    get: _get,
    isArray: isArray,
  },
  pathToString,
  hasChildren
);

module.exports = deps;
