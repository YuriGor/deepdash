'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getMapDeep = require('./getMapDeep.js');

/* build/tpl */

function addMapDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapDeep', getMapDeep(_), !getMapDeep.notChainable);
}

module.exports = addMapDeep;
