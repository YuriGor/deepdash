'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getPaths = require('./getPaths.js');

function addPaths(_) {
  var mixOrPatchIn = getMixOrPatchIn.default(_);
  return mixOrPatchIn('paths', getPaths(_));
}

module.exports = addPaths;
