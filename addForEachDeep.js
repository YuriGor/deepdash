'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getForEachDeep = require('./getForEachDeep.js');

/* build/tpl */

function addForEachDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('forEachDeep', getForEachDeep(_), !getForEachDeep.notChainable);
}

module.exports = addForEachDeep;
