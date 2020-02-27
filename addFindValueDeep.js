'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getFindValueDeep = require('./getFindValueDeep.js');

function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findValueDeep', getFindValueDeep(_));
}

module.exports = addFindDeep;
