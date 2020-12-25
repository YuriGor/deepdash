'use strict';

var getFindPathDeep = require('./getFindPathDeep.js');
var findDeep = require('./deps/findDeep.js');

/* build/tpl */
var findPathDeep = getFindPathDeep(findDeep);

module.exports = findPathDeep;
