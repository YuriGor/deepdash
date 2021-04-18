'use strict';

var _merge = require('lodash/merge.js');
var _isString = require('lodash/isString.js');
var _toPath = require('lodash/toPath.js');
var pathToString = require('./pathToString.js');
var _cloneDeep = require('lodash/cloneDeep.js');
var _isEqual = require('lodash/isEqual.js');
var _takeRight = require('lodash/takeRight.js');

var deps = _merge(
  {
    isString: _isString,
    toPath: _toPath,
    isEqual: _isEqual,
    takeRight: _takeRight,
    cloneDeep: _cloneDeep,
  },
  pathToString
);

module.exports = deps;
