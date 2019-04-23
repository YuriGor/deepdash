'use strict';

var __chunk_1 = require('./chunk-46374642.js');
var getPathToString = require('./getPathToString.js');

function addPathToString(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('pathToString', getPathToString(_), false);
}

module.exports = addPathToString;
