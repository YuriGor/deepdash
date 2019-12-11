'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getPaths = require('./getPaths.js');

function addKeysDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('keysDeep', getPaths(_));
}

module.exports = addKeysDeep;
