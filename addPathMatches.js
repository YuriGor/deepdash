'use strict';

var __chunk_1 = require('./chunk-46374642.js');
require('./getPathToString.js');
var getPathMatches = require('./getPathMatches.js');

function addPathMatches(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('pathMatches', getPathMatches(_), false);
}

module.exports = addPathMatches;
