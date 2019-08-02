'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getCondense = require('./getCondense.js');

function addCondense(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('condense', getCondense());
}

module.exports = addCondense;
