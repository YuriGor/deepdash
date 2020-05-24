'use strict';

var getKeysDeep = require('./getKeysDeep.js');
var paths = require('./deps/paths.js');

/* build/tpl */
var keysDeep = getKeysDeep(paths);

module.exports = keysDeep;
