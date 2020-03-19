'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getFindValueDeep = require('./getFindValueDeep.js');

/* build/tpl */

function addFindValueDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findValueDeep', getFindValueDeep(_), !getFindValueDeep.notChainable);
}

module.exports = addFindValueDeep;
