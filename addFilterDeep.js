'use strict';

var getMixOrPatchIn = require('./private/getMixOrPatchIn.js');
var getFilterDeep = require('./getFilterDeep.js');

function addFilterDeep(_) {
  var mixOrPatchIn = getMixOrPatchIn.default(_);
  return mixOrPatchIn('filterDeep', getFilterDeep(_));
}

module.exports = addFilterDeep;
