'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getFindValueDeep = require('./getFindValueDeep.js');

//console.log('getFindValueDeep',getFindValueDeep.notChainable);
function addFindValueDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findValueDeep', getFindValueDeep(_), !getFindValueDeep.notChainable);
}

module.exports = addFindValueDeep;
