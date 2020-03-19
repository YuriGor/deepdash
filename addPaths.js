'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getPaths = require('./getPaths.js');

/* build/tpl */

function addPaths(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('paths', getPaths(_), !getPaths.notChainable);
}

module.exports = addPaths;
