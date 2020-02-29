'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getObtain = require('./getObtain.js');

//console.log('getObtain',getObtain.notChainable);
function addObtain(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('obtain', getObtain(_), !getObtain.notChainable);
}

module.exports = addObtain;
