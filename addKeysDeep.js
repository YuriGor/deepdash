'use strict';

var __chunk_1 = require('./chunk-46374642.js');
require('./getPathToString.js');
require('./getEachDeep.js');
var getPaths = require('./getPaths.js');

function addKeysDeep(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('keysDeep', getPaths(_));
}

module.exports = addKeysDeep;
