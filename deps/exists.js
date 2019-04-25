'use strict';

var isArray = require('./own/isArray.js');
var _toPath = require('lodash/toPath');
var _get = require('lodash/get');
var _clone = require('lodash/clone');

var deps = {
  isArray: isArray,
  clone: _clone,
  toPath: _toPath,
  get: _get,
};

exports.default = deps;
