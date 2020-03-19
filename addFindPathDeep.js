'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getFindPathDeep = require('./getFindPathDeep.js');

/* build/tpl */

function addFindPathDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('findPathDeep', getFindPathDeep(_), !getFindPathDeep.notChainable);
}

module.exports = addFindPathDeep;
