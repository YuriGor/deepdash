'use strict';

var __chunk_1 = require('./chunk-46374642.js');
require('./getCondense.js');
require('./getPathToString.js');
require('./getEachDeep.js');
require('./getCondenseDeep.js');
require('./getExists.js');
require('./getObtain.js');
require('./getFilterDeep.js');
require('./getPathMatches.js');
var getOmitDeep = require('./getOmitDeep.js');

function addOmitDeep(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('omitDeep', getOmitDeep(_));
}

module.exports = addOmitDeep;
