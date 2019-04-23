'use strict';

var __chunk_1 = require('./chunk-46374642.js');
require('./getCondense.js');
require('./getPathToString.js');
require('./getEachDeep.js');
var getCondenseDeep = require('./getCondenseDeep.js');

function addCondenseDeep(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('condenseDeep', getCondenseDeep(_));
}

module.exports = addCondenseDeep;
