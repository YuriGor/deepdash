'use strict';

var __chunk_4 = require('./condense.js');
var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var forArray = require('./own/forArray.js');
var __chunk_8 = require('./eachDeep.js');

var deps = _merge(
  {
    merge: _merge,
    isArray: isArray,
    forArray: forArray,
  },
  __chunk_4.default,
  __chunk_8.default
);

exports.default = deps;
