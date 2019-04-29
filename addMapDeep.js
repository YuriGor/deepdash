'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getMapDeep = require('./getMapDeep.js');

function addMapDeep(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('mapDeep', getMapDeep(_));
}

module.exports = addMapDeep;
