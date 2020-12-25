'use strict';

var getFindValueDeep = require('./getFindValueDeep.js');
var findDeep = require('./deps/findDeep.js');

/* build/tpl */
var findValueDeep = getFindValueDeep(findDeep);

module.exports = findValueDeep;
