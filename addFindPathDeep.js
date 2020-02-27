'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getFindPathDeep = require('./getFindPathDeep.js');

function addFindDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findPathDeep', getFindPathDeep(_));
}

module.exports = addFindDeep;
