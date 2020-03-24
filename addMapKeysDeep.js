'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getMapKeysDeep = require('./getMapKeysDeep.js');

/* build/tpl */

function addMapKeysDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapKeysDeep', getMapKeysDeep(_), !getMapKeysDeep.notChainable);
}

module.exports = addMapKeysDeep;
