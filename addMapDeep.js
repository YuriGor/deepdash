'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getMapDeep = require('./getMapDeep.js');

function addMapDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn(_);
  return mixOrPatchIn('mapDeep', getMapDeep(_));
}

module.exports = addMapDeep;
