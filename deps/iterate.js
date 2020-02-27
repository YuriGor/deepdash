'use strict';

var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var forArray = require('./own/forArray.js');
var _isObject = require('lodash/isObject');
var _isEmpty = require('lodash/isEmpty');
var _findIndex = require('lodash/findIndex');
var _forOwn = require('lodash/forOwn');
var _get = require('lodash/get');
var hasChildren = require('./hasChildren.js');
var pathToString = require('./pathToString.js');

var deps = _merge(
  {
    isObject: _isObject,
    isEmpty: _isEmpty,
    findIndex: _findIndex,
    forOwn: _forOwn,
    forArray: forArray,
    get: _get,
    isArray: isArray,
  },
  pathToString,
  hasChildren
);

module.exports = deps;
