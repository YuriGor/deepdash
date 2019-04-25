'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getPaths = require('./getPaths.js');

function addPaths(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('paths', getPaths(_));
}

module.exports = addPaths;
