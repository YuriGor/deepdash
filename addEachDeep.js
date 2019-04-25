'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getEachDeep = require('./getEachDeep.js');

function addEachDeep(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('eachDeep', getEachDeep(_));
}

module.exports = addEachDeep;
