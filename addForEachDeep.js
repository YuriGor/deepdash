'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getEachDeep = require('./getEachDeep.js');

function addForEachDeep(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('forEachDeep', getEachDeep(_));
}

module.exports = addForEachDeep;
