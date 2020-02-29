'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getPathMatches = require('./getPathMatches.js');

//console.log('getPathMatches',getPathMatches.notChainable);
function addPathMatches(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathMatches', getPathMatches(_), !getPathMatches.notChainable);
}

module.exports = addPathMatches;
