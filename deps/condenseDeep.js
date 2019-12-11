'use strict';

var condense$1 = require('./condense.js');
var _merge = require('lodash/merge');
var isArray = require('./own/isArray.js');
var forArray = require('./own/forArray.js');
var eachDeep = require('./eachDeep.js');

var deps = _merge(
  {
    merge: _merge,
    isArray: isArray,
    forArray: forArray,
  },
  condense$1,
  eachDeep
);

module.exports = deps;
