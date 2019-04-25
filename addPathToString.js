'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getPathToString = require('./getPathToString.js');

function addPathToString(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('pathToString', getPathToString(_), false);
}

module.exports = addPathToString;
