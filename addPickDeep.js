'use strict';

var __chunk_1 = require('./chunk-27bec025.js');
require('./getCondense.js');
require('./getPathToString.js');
require('./getEachDeep.js');
require('./getCondenseDeep.js');
require('./getExists.js');
require('./getObtain.js');
require('./getFilterDeep.js');
require('./getPathMatches.js');
require('./getOmitDeep.js');
var getPickDeep = require('./getPickDeep.js');

function addPickDeep(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('pickDeep', getPickDeep(_));
}

module.exports = addPickDeep;
