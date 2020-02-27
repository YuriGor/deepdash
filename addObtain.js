'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getObtain = require('./getObtain.js');

function addObtain(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('obtain', getObtain(_), true);
}

module.exports = addObtain;
