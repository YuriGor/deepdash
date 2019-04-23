'use strict';

var __chunk_1 = require('./chunk-27bec025.js');
var getCondense = require('./getCondense.js');

function addCondense(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('condense', getCondense(_));
}

module.exports = addCondense;
