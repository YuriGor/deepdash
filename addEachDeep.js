'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getEachDeep = require('./getEachDeep.js');

function addEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('eachDeep', getEachDeep(_));
}

module.exports = addEachDeep;
