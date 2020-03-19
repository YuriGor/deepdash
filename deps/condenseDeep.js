'use strict';

var condense = require('./condense.js');
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
  condense,
  eachDeep
);

module.exports = deps;
