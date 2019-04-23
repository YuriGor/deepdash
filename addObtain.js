'use strict';

var __chunk_1 = require('./chunk-27bec025.js');
var getObtain = require('./getObtain.js');

function addObtain(_) {
  var mixOrPatchIn = __chunk_1.getMixOrPatchIn(_);
  return mixOrPatchIn('obtain', getObtain(_), true);
}

module.exports = addObtain;
