'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getPathMatches = require('./getPathMatches.js');

function addPathMatches(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('pathMatches', getPathMatches(_), false);
}

module.exports = addPathMatches;
