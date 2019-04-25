'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getOmitDeep = require('./getOmitDeep.js');

function addOmitDeep(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('omitDeep', getOmitDeep(_));
}

module.exports = addOmitDeep;
