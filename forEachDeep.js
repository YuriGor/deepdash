'use strict';

var getForEachDeep = require('./getForEachDeep.js');
var eachDeep = require('./deps/eachDeep.js');

/* build/tpl */
var forEachDeep = getForEachDeep(eachDeep);

module.exports = forEachDeep;
