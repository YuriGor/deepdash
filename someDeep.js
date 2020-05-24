'use strict';

var getSomeDeep = require('./getSomeDeep.js');
var findDeep$1 = require('./deps/findDeep.js');

/* build/tpl */
var someDeep = getSomeDeep(findDeep$1);

module.exports = someDeep;
