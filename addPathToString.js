'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getPathToString = require('./getPathToString.js');

function addPathToString(_) {
  var mixOrPatchIn = getMixOrPatchIn.default(_);
  return mixOrPatchIn('pathToString', getPathToString(_), false);
}

module.exports = addPathToString;
