'use strict';

var _merge = require('lodash/merge.js');
var _identity = require('lodash/identity.js');
var _isString = require('lodash/isString.js');
var _toPath = require('lodash/toPath.js');
var iterate = require('./iterate.js');

var deps = _merge(
  {
    identity: _identity,
    merge: _merge,
    isString: _isString,
    toPath: _toPath,
  },
  iterate
);

module.exports = deps;
