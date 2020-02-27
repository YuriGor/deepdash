'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getEachDeep = require('./getEachDeep.js');

function addForEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('forEachDeep', getEachDeep(_));
}

module.exports = addForEachDeep;
