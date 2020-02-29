'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getEachDeep = require('./getEachDeep.js');

//console.log('getEachDeep',getEachDeep.notChainable);
function addEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('eachDeep', getEachDeep(_), !getEachDeep.notChainable);
}

module.exports = addEachDeep;
