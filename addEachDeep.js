'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getEachDeep = require('./getEachDeep.js');

/* build/tpl */

function addEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('eachDeep', getEachDeep(_), !getEachDeep.notChainable);
}

module.exports = addEachDeep;
