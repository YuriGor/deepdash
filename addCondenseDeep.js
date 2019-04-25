'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getCondenseDeep = require('./getCondenseDeep.js');

function addCondenseDeep(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('condenseDeep', getCondenseDeep(_));
}

module.exports = addCondenseDeep;
