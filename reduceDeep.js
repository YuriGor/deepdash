'use strict';

var getReduceDeep = require('./getReduceDeep.js');
var eachDeep = require('./deps/eachDeep.js');

/* build/tpl */
var reduceDeep = getReduceDeep(eachDeep);

module.exports = reduceDeep;
