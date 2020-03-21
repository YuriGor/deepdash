'use strict';

var isEmpty = require('./own/isEmpty.js');
var _get = require('lodash/get');
var _some = require('lodash/some');

var deps = {
  some: _some,
  get: _get,
  isEmpty: isEmpty,
};

module.exports = deps;
