'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getFindDeep = require('./getFindDeep.js');

function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findDeep', getFindDeep(_));
}

module.exports = addFindDeep;
