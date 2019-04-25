'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getPaths = require('./getPaths.js');

function addKeysDeep(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('keysDeep', getPaths(_));
}

module.exports = addKeysDeep;
