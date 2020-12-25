'use strict';

var getSomeDeep = require('./getSomeDeep.js');
var findDeep = require('./deps/findDeep.js');

/* build/tpl */
var someDeep = getSomeDeep(findDeep);

module.exports = someDeep;
