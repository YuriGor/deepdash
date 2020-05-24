'use strict';

var getReduceDeep = require('./getReduceDeep.js');
var eachDeep$1 = require('./deps/eachDeep.js');

/* build/tpl */
var reduceDeep = getReduceDeep(eachDeep$1);

module.exports = reduceDeep;
