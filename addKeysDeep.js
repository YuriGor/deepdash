'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getKeysDeep = require('./getKeysDeep.js');

/* build/tpl */

function addKeysDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('keysDeep', getKeysDeep(_), !getKeysDeep.notChainable);
}

module.exports = addKeysDeep;
