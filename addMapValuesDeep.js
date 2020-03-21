'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getMapValuesDeep = require('./getMapValuesDeep.js');

/* build/tpl */

function addMapValuesDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapValuesDeep', getMapValuesDeep(_), !getMapValuesDeep.notChainable);
}

module.exports = addMapValuesDeep;
