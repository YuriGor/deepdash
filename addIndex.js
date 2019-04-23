'use strict';

var __chunk_1 = require('./chunk-46374642.js');
require('./getPathToString.js');
require('./getEachDeep.js');
var getIndex = require('./getIndex.js');

function addIndex(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('index', getIndex(_));
}

module.exports = addIndex;
