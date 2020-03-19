'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getPathToString = require('./getPathToString.js');

/* build/tpl */

function addPathToString(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('pathToString', getPathToString(_), !getPathToString.notChainable);
}

module.exports = addPathToString;
