'use strict';

var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var forArray = require('./own/forArray.js');
var _isObject = require('lodash/isObject');
var _isEmpty = require('lodash/isEmpty');
var _findIndex = require('lodash/findIndex');
var _forOwn = require('lodash/forOwn');
var _get = require('lodash/get');
var __chunk_5 = require('./hasChildren.js');
var __chunk_6 = require('./pathToString.js');

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
  __chunk_6.default,
  __chunk_5.default
);

exports.default = deps;
