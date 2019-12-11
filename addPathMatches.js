'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getPathMatches = require('./getPathMatches.js');

function addPathMatches(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathMatches', getPathMatches(_), false);
}

module.exports = addPathMatches;
