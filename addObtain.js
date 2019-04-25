'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getObtain = require('./getObtain.js');

function addObtain(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('obtain', getObtain(_), true);
}

module.exports = addObtain;
