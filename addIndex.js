'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getIndex = require('./getIndex.js');

function addIndex(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('index', getIndex(_));
}

module.exports = addIndex;
