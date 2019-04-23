'use strict';

var __chunk_1 = require('./chunk-27bec025.js');
require('./getPathToString.js');
var getEachDeep = require('./getEachDeep.js');

function addForEachDeep(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('forEachDeep', getEachDeep(_));
}

module.exports = addForEachDeep;
