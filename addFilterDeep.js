'use strict';

var __chunk_1 = require('./private/getMixOrPatchIn.js');
var getFilterDeep = require('./getFilterDeep.js');

function addFilterDeep(_) {
  var mixOrPatchIn = __chunk_1.default(_);
  return mixOrPatchIn('filterDeep', getFilterDeep(_));
}

module.exports = addFilterDeep;
