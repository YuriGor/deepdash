'use strict';

var __chunk_1 = require('./chunk-27bec025.js');
require('./getCondense.js');
require('./getPathToString.js');
require('./getEachDeep.js');
require('./getCondenseDeep.js');
require('./getExists.js');
require('./getObtain.js');
var getFilterDeep = require('./getFilterDeep.js');

function addFilterDeep(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('filterDeep', getFilterDeep(_));
}

module.exports = addFilterDeep;
