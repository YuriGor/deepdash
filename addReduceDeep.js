'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getReduceDeep = require('./getReduceDeep.js');

function addCondense(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('reduceDeep', getReduceDeep(_));
}

module.exports = addCondense;
